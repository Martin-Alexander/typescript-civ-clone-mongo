module Unit
  class Base < MongoidModel
    embedded_in :square, class_name: 'Square::Global'

    field :player_number, type: Integer, default: 0
    field :moves,         type: Integer, default: 0
    field :order,         type: String,  default: 'none'
    field :state,         type: String,  default: 'none'
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
    def order?
      order != 'none'
    end

    # Updates a unit's orders after rule checking
    def give_order(order_name)
      if unit_rules['allowed_orders'].include?(order_name)
        new_order = order == order_name ? 'none' : order_name
        update(order: new_order)
        true
      else
        false
      end
    end

    # Applies game logic turning an order into state
    def execute_order
      case Rules['orders'][order]['type']
      when 'unit_state_transform'
        update(state: Rules['orders'][order]['transform_to'])
      when 'construction'
        structure_type = Rules['orders'][order]['structure']
        execute_construction_order(structure_type)
      when 'action'
        move(go_to)
      end
    end

    # ==== General untility methods ====

    # The base movement value of a unit
    def base_moves
      Rules['units'][type]['movement']['base']
    end

    # returns string representation of unit type
    def type
      _type.split('::').last.downcase
    end

    # Returns the rules for unit
    def unit_rules
      Rules['units'][type]
    end

    # ==== Movement methods ====

    # Actually updates the database with new move
    def execute_move(new_unit_fields, to_square)
      new_unit = dup
      to_square.send(type.pluralize.to_sym).send(:push, new_unit)
      new_unit.update(new_unit_fields)
      delete

      new_unit
    end

    # Default move validations
    def valid_move_path(move_path)
      are_adjacent(move_path) && are_free_of_units(move_path)
    end

    # Should be only move function
    # TODO: Refactor this abomination
    def move(path)
      move_path = MovePath.new(square.board, path)

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
        new_order = 'go'
      elsif immediate_path.moves.any? && go_to_path.empty?
        move_to_square = immediate_path.moves.last.to
        new_order = 'none'
      elsif immediate_path.moves.empty? && go_to_path.any?
        move_to_square = square
        new_order = 'go'
      end

      [move_to_square, new_order]
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
