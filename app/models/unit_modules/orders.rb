module UnitModules
  module Orders
    # Returns whether or not a unit has a non-none order
    def order?
      order != "none"
    end

    # Updates a unit's orders after rule checking
    def give_order(order_name)
      if unit_rules["allowed_orders"].include?(order_name)
        new_order = order == order_name ? "none" : order_name
        update(order: new_order)
        true
      else
        false
      end
    end

    # Applies game logic turning an order into state
    def execute_order
      result = nil
      case Rules.raw["orders"][order]["type"]
      when "unit_state_transform"
        update(state: Rules.raw["orders"][order]["transform_to"])
      when "construction"
        structure_type = Rules.raw["orders"][order]["structure"]
        execute_construction_order(structure_type)
      when "action"
        result = move(go_to)
      end

      result
    end
  end
end
