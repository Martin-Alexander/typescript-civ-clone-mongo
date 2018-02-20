module UnitModules
  module Orders
    # Returns whether or not a unit has a non-none order
    def order?
      order != "none"
    end

    # Updates a unit's orders after rule checking
    def give_order(order_name)
      if Rules.allowed_orders(self).include?(order_name)
        update!(order: order == order_name ? "none" : order_name)
        true
      else
        false
      end
    end

    # Applies game logic turning an order into state, and, importantly can return a move result that
    # will be used by the front end to animate the moved unit
    def execute_order
      move_result = nil
      case Rules.order_type(order)
      when "unit_state_transform"
        update(state: Rules.raw["orders"][order]["transform_to"])
      when "construction"
        execute_construction_order(Rules.order_structure(order))
      when "action"
        move_result = move(go_to)
      end

      move_result
    end
  end
end
