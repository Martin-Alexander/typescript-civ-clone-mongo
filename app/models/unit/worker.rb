module Unit
  class Worker < Base
    def create_structure(structure_name)
      unless Rules.raw["structures"].keys.include?(structure_name)
        raise ArgumentError, "#{structure_name} is not a valid structure"
      end
      square.create_structure(structure_name, player_number: player_number)
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
  end
end