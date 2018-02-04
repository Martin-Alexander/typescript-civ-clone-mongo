module UnitModules
  module Movement
    # Actually updates the database with new move
    def execute_move(new_unit_fields, to_square)
      new_unit = dup
      to_square.send(type.pluralize.to_sym).send(:push, new_unit)
      new_unit.update(new_unit_fields)
      delete

      new_unit
    end

    # Returns the units move to their base movement
    def set_base_moves
      update(moves: base_moves)
    end

    # Default move validations
    def valid_move_path(move_path)
      are_adjacent(move_path) && are_free_of_units(move_path)
    end

    # Should be only move function
    # TODO: Refactor this abomination
    def move(path)
      move_path = Movement::Order.new(square.board, path)

      if valid_move_path(move_path)
        moves_left = moves
        immediate_path = [move_path.path.first]
        go_to_path = [move_path.path.first]

        out_of_moves = false

        move_path.moves.each_with_index do |move, i|
          out_of_moves = move.cost > moves_left || out_of_moves

          if !out_of_moves
            moves_left -= move.cost
            immediate_path << path[i + 1]
            go_to_path = [path[i + 1]]
          else
            go_to_path << path[i + 1]
          end
        end

        go_to_path = [] if go_to_path.length == 1

        move_to_square, new_order = calculate_move_to_square_and_new_order(immediate_path, go_to_path)

        return {
          move_unit: execute_move({ moves: moves_left, go_to: go_to_path, order: new_order }, move_to_square).to_hash,
          new_squares: [square.to_hash, move_to_square.to_hash],
          success: true,
          path: immediate_path
        }
      end

      { success: false, path: [] }
    end

    def calculate_move_to_square_and_new_order(immediate_path, go_to_path)
      immediate_path = MovePath.new(square.board, immediate_path)

      if immediate_path.moves.any? && go_to_path.any?
        move_to_square = immediate_path.moves.last.to
        new_order = "go"
      elsif immediate_path.moves.any? && go_to_path.empty?
        move_to_square = immediate_path.moves.last.to
        new_order = "none"
      elsif immediate_path.moves.empty? && go_to_path.any?
        move_to_square = square
        new_order = "go"
      end

      [move_to_square, new_order]
    end
  end
end
