module Unit
  class Base < MongoidModel
    embedded_in :square, class_name: "Square::Global"

    field :player_number, default: 0
    
    # Default move execution
    def execute_move(to_square)
      to_square.infantry << self.dup
      self.delete
    end

    def valid_move_path(move_path)
      return are_adjacent(move_path) && are_free_of_units(move_path)
    end

    def move(path)
      initial_moves_left = 0
      move_results = { success: false, path: path, new_squares: [] }
      move_path = MovePath.new(square.board, path)

      if valid_move_path(move_path)
        execute_move(move_path.last.to)
        move_results[:success] = true
        move_results[:new_squares] = [move_path.first.from, move_path.last.to]
      end
      return move_results
    end

    def are_adjacent(move_path)
      move_path.all? do |move|
        move.from.neighbours.include?(move.to)
      end
    end

    def are_free_of_units(move_path)
      move_path.all? do |move|
        move.to.units.empty?
      end
    end
  end
end