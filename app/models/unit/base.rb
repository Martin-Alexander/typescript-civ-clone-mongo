module Unit
  class Base < MongoidModel
    embedded_in :square, class_name: "Square::Global"

    field :player_number, type: Integer, default: 0
    field :moves,         type: Integer, default: 0
    field :order,         type: String,  default: "none"
    field :state,         type: String,  default: "none"
    field :go_to,         type: Array,   default: []

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

    # ==== Movement methods ====

    # Actually updates the database with new move
    def execute_move(new_unit_fields, to_square)
      new_unit = self.dup
      to_square.send(type.pluralize.to_sym).send(:push, new_unit)
      new_unit.update(new_unit_fields)
      self.delete

      return new_unit      
    end

    # Default move validations
    def valid_move_path(move_path)
      return(
        are_adjacent(move_path) && 
        are_free_of_units(move_path)
      )
    end

    # Should be only move function
    # TODO: Refactor this abomination
    def move(path)
      move_results = { success: false, path: [], new_squares: nil }
      move_path = MovePath.new(square.board, path)

      if valid_move_path(move_path)
        moves_left = moves
        immediate_path = [move_path.path.first]
        go_to_path = []

        move_path.moves.each_with_index do |move, i|
          if move.cost <= moves_left
            moves_left -= move.cost
            immediate_path << path[i + 1]
          else
            go_to_path << path[i + 1]
          end
        end

        immediate_move_path = MovePath.new(square.board, immediate_path)

        new_unit_fields = { moves: moves_left}

        if go_to_path.any?
          new_unit_fields[:go_to] = go_to_path
          new_unit_fields[:order] = "go"
        elsif order == "go"
          new_unit_fields[:go_to] = []
          new_unit_fields[:order] = "none"
        end

        if immediate_move_path.moves.any?
          move_to_square = immediate_move_path.moves.last.to
          move_results[:moved_unit] = execute_move(new_unit_fields, move_to_square).to_hash
          move_results[:new_squares] = [square.to_hash, move_to_square.to_hash]
        else
          move_to_square = square
          move_results[:moved_unit] = execute_move(new_unit_fields, move_to_square).to_hash
          move_results[:new_squares] = [square.to_hash]
        end
        
        move_results[:success] = true
        move_results[:path] = immediate_path
        move_results[:go_to] = go_to_path
      end

      return move_results
    end

    # ---- Move validation methods ----

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