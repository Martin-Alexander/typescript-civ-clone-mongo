module Movement
  # Represents a users movement command
  class Input
    attr_reader :immediate_turn_move, :go_to_turn_moves

    # Accepts the two pieces of information given by the user: the unit, and the path
    def initialize(unit, coordinate_path, validations)
      @unit = unit
      @path = coordinate_path
      @validations = validations

      @atomic_moves = TurnMoveBuilder.build(@path, @unit, game)

      build_immediate_turn_move_and_go_to_turn_moves
      validate_immediate_turn_move
      execute if @success
    end
    
    # Returns whether or not the immediate move can be executed
    def validate_immediate_turn_move
      @success = @validations.all? do |validation|
        @unit.send(validation, @immediate_turn_move.atomic_moves)
      end
    end
    
    # Updated database
    def execute
      new_unit = @unit.dup
      new_unit.moves = @remaining_moves
      new_unit.go_to = @go_to_turn_moves.coordinate_path
      new_unit.order = units_new_order

      to_square.send(@unit.type.pluralize.to_sym).send(:push, new_unit)
      @unit.delete

      @unit = new_unit      
    end
    
    # Returns information need by front end to animate move
    def front_end_move_result
      {
        moved_unit: @unit.to_hash,
        new_squares: [from_square, to_square].map(&:to_hash),
        success: @success,
        path: @immediate_turn_move.coordinate_path
      }      
    end

    def to_square
      if @immediate_turn_move.atomic_moves.any?
        @immediate_turn_move.atomic_moves.last.to_square
      else
        from_square
      end
    end

    def from_square
      @atomic_moves.first.from_square
    end

    private
    
    def game
      @unit.square.game
    end
    
    def build_immediate_turn_move_and_go_to_turn_moves
      results = ImmediateTurnMoveAndGoToTurnMoves.build(@unit, @atomic_moves)
  
      @immediate_turn_move = results.immediate_turn_move
      @go_to_turn_moves = results.go_to_turn_moves
      @remaining_moves = results.remaining_moves
    end

    def units_new_order
      @go_to_turn_moves.atomic_moves.empty? ? "none" : "go"
    end
  end
end
