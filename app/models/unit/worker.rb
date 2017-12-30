module Unit
  class Worker < Base
    def create_structure(structure_name)
      if Rules["structures"].keys.include?(structure_name)
        square.structures.create(type: structure_name, player_number: player_number)
      else
        raise ArgumentError, "#{structure_name} is not a valid structure"
      end
    end

    def execute_construction_order(structure_name)
      if square.has_complete_structure(structure_name)
        update(order: "none")
      else
        if square.structure_status(structure_name) == "absent"
          create_structure(structure_name)
          square.get_structure(structure_name).build
        elsif square.structure_status(structure_name) == "under_contruction"
          square.get_structure(structure_name).build
        end

        if square.get_structure(structure_name).complete
          update(order: "none")
        end

        update(moves: 0)
      end
    end
  end
end