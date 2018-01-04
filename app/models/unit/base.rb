module Unit
  class Base < MongoidModel
    embedded_in :square, class_name: "Square::Global"

    field :player_number, type: Integer, default: 0
    field :moves,         type: Integer, default: 0
    field :order,         type: String,  default: "none"
    field :state,         type: String,  default: "none"
    field :go_to_path,    type: Array,   default: []

    after_create :set_base_moves

    def set_base_moves
      update(moves: base_moves)
    end

    # ==== Next turn methods ====

    # Executes all methods involved in turn roll over
    def apply_turn_rollover_logic
      update(moves: base_moves)
      execute_order
    end

    # ==== Order methods ====
    
    # Returns whether or not a unit has a non-none order
    def has_order?
      order != "none"
    end

    # Updates a unit's orders after rule checking
    def give_order(order_name)
      if unit_rules["allowed_orders"].include?(order_name)
        new_order = order == order_name ? "none" : order_name
        update(order: new_order)
        return true
      else
        return false
      end
    end

    # Applies game logic turning an order into state
    def execute_order
      if Rules["orders"][order]["type"] == "unit_state_transform"
        update(state: Rules["orders"][order]["transform_to"])
        # update(order: "none")
      elsif Rules["orders"][order]["type"] == "construction"
        structure_type = Rules["orders"][order]["structure"]
        execute_construction_order(structure_type)
      end
    end

    # ==== General untility methods ====

    # The base movement value of a unit
    def base_moves
      Rules["units"][type]["movement"]["base"]
    end

    # returns string representation of unit type
    def type
      _type.split("::").last.downcase
    end

    # Returns the rules for unit
    def unit_rules
      Rules["units"][type]
    end

    # Returns whether or not the unit belongs to a given user
    def is_unit_owner(user)
      square.board.game_players.where(number: player_number).first.user_id == user.id.to_s
    end


    # ==== Movement methods ====

    # Actually updates the database with new move
    def execute_move(to_square)
      new_unit = self.dup
      to_square.send(type.pluralize.to_sym).send(:push, new_unit)
      self.delete

      return new_unit      
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
        moved_unit = execute_move(move_path.last.to)
        move_results[:moved_unit] = moved_unit
        move_results[:success] = true
        move_results[:new_squares] = [move_path.first.from.to_hash, move_path.last.to.to_hash]
      end

      return move_results
    end

    # ---- Move validation methods ----

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
  end
end