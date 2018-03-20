module UnitModules
  module Moving
    # Returns the units move to their base movement
    def set_base_moves
      update(moves: base_moves)
    end

    # Default move validations
    def validations
      [:are_adjacent, :are_free_of_units]
    end

    # Should be only move function
    # TODO: Refactor this abomination
    def move(path)
      Movement::Input.new(self, path, validations).front_end_move_result
    end
  end
end
