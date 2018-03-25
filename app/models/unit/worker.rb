module Unit
  class Worker < Base
    def combat?
      false
    end

    # Creates a structure object in the workers square
    def create_structure(structure_name)
      square.create_structure(structure_name, player_number: player_number)
    end

    # Entry point of structure construction actions
    def execute_construction_order(structure_name)
      return false unless allowed_structures_to_build.include?(structure_name)
      perform_construction(structure_name)
      if square.structure(structure_name).complete
        update(moves: 0, order: "none")
      else
        update(moves: 0)
      end
    end

    private

    # Returns an array of all the structures a worker is allowed to build
    def allowed_structures_to_build
      allowed_build_orders = Rules.orders_for_worker(self).select do |order|
        Rules.order_type(order) == "construction" && Rules.order_structure(order)
      end

      allowed_build_orders.map { |order| Rules.order_structure(order) }
    end

    # Performs construction actions, whether it being building, creating, or growing
    def perform_construction(structure_name)
      if !square.structure(structure_name).nil? &&
         square.structure(structure_name).complete &&
         square.structure(structure_name).type == "city"
        grow_city(structure_name)
      else
        build_structure(structure_name)
      end
    end

    # Create a new structure or build on one if it already exists
    def build_structure(structure_name)
      create_structure(structure_name) if square.structure_status(structure_name) == "absent"
      square.structure(structure_name).build
    end

    # Add to the city structures size
    def grow_city(structure_name)
      square.structure(structure_name).grow
    end
  end
end
