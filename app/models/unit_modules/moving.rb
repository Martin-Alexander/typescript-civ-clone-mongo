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
      move_path = Movement::Order.new(
        unit: self,
        path: path,
        validations: validations
      )

      move_path.execute.to_hash
    end
  end
end
