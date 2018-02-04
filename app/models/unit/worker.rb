module Unit
  class Worker < Base
    def create_structure(structure_name)
      unless Rules["structures"].keys.include?(structure_name)
        raise ArgumentError, "#{structure_name} is not a valid structure"
      end
      square.structures.create(type: structure_name, player_number: player_number)
    end

    def execute_construction_order(structure_name)
      if square.complete_structure?(structure_name)
        update(order: "none")
        update(moves: base_moves)
      elsif moves > 0
        if square.structure_status(structure_name) == "absent"
          create_structure(structure_name)
          square.get_structure(structure_name).build
        elsif square.structure_status(structure_name) == "under_contruction"
          square.get_structure(structure_name).build
        end
        update(order: "none") if square.get_structure(structure_name).complete
        update(moves: 0)
      else
        update(moves: base_moves)
      end
    end

    # Applies game logic turning an order into state
    # def execute_order
    #   if Rules["orders"][order]["type"] == "unit_state_transform"
    #     update(state: Rules["orders"][order]["transform_to"])
    #     update(moves: base_moves)
    #   elsif Rules["orders"][order]["type"] == "construction"
    #     structure_type = Rules["orders"][order]["structure"]
    #     execute_construction_order(structure_type)
    #   else
    #     update(moves: base_moves)
    #   end
    # end

    # Executes all methods involved in turn roll over
    # def apply_turn_rollover_logic
    #   execute_order
    # end
  end
end