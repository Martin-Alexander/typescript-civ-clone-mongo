module Unit
  class Worker < Base
    def create_structure(structure_name)
      square.create_structure(structure_name, player_number: player_number)
    end

    def allowed_structures_to_build
      allowed_build_orders = Rules.orders_for_worker(self).select do |order| 
        Rules.order_type(order) == "construction" && Rules.order_structure(order)
      end

      allowed_build_orders.map { |order| Rules.order_structure(order) }
    end

    def execute_construction_order(structure_name)
      if allowed_structures_to_build.include?(structure_name)
        create_or_build_structure(structure_name)
        if square.structure(structure_name).complete
          update(moves: 0, order: "none")
        else 
          update(moves: 0)
        end
      end
    end

    def create_or_build_structure(structure_name)
      if square.structure_status(structure_name) == "absent"
        create_structure(structure_name)
        square.structure(structure_name).build
      elsif square.structure_status(structure_name) == "under_contruction"
        square.structure(structure_name).build
      elsif square.structure(structure_name).complete && 
            square.structure(structure_name).type == "city"
        square.structure(structure_name).grow
      end
    end
  end
end