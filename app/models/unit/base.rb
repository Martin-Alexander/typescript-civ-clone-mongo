module Unit
  class Base < MongoidModel
    embedded_in :square, class_name: "Square::Global"

    field :player_number, default: 0
    field :moves, default: 2
    field :orders, default: "none"
    field :state, default: "none"
    
    def update_state_from_orders

    end

    # The base movement value of a unit
    def base_moves
      2
    end

    # Default move execution
    def execute_move(to_square)
      to_square.infantry << self.dup
      self.delete
    end

    # Default move validations
    def valid_move_path(move_path)
      return(
        are_adjacent(move_path) && 
        are_free_of_units(move_path) && 
        has_enough_moves(move_path)
      )
    end

    # Should be only move function
    def move(user, path)
      move_results = { success: false, path: path, new_squares: nil }
      move_path = MovePath.new(square.board, path)

      if valid_move_path(move_path) && is_unit_owner(user)
        update(moves: moves - move_path.total_move_cost)
        execute_move(move_path.last.to)
        move_results[:success] = true
        move_results[:new_squares] = [move_path.first.from, move_path.last.to]
      end

      return move_results
    end

    # All moves are to adjacent squares
    def are_adjacent(move_path)
      move_path.all? do |move|
        move.from.neighbours.include?(move.to)
      end
    end

    # All moves are to squares with no units
    def are_free_of_units(move_path)
      move_path.all? do |move|
        move.to.units.empty?
      end
    end

    # Unit has more are at least as many as the move path costs
    def has_enough_moves(move_path)
      moves >= move_path.total_move_cost
    end

    def is_unit_owner(user)
      square.board.game_players.where(number: player_number).first.user_id == user.id.to_s
    end
  end
end