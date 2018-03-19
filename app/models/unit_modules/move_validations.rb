module UnitModules
  module MoveValidations
    # All moves are to adjacent squares
    def are_adjacent(moves)
      moves.all? do |move|
        move.from_square.neighbours.include?(move.to_square)
      end
    end

    # All moves are to squares with no units
    def are_free_of_units(moves)
      moves.all? do |move|
        move.to_square.units.empty?
      end
    end
  end
end
