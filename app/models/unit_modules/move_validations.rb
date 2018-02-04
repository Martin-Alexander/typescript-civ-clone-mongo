module UnitModules
  module MoveValidations
    # All moves are to adjacent squares
    def are_adjacent(move_path)
      move_path.moves.all? do |move|
        move.from.neighbours.include?(move.to)
      end
    end

    # All moves are to squares with no units
    def are_free_of_units(move_path)
      move_path.moves.all? do |move|
        move.to.units.empty?
      end
    end
  end
end
