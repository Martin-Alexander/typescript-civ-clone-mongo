module Unit
  class Worker < Base
    def create_structure(structure_name)
      if Rules["structures"].keys.include?(structure_name)
        square.structures.create(type: structure_name, player_number: player_number)
      else
        raise ArgumentError, "#{structure_name} is not a valid structure"
      end
    end
  end
end