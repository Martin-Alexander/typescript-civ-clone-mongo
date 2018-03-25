module Merging
  class Input
    def initialize(unit, coordinate_path, validations)
      @unit = unit
      @path = coordinate_path
      @validations = validations

      @atomic_moves = Movement::TurnMoveBuilder.build(@path, @unit, game)
      @turn_move = Movement::TurnMove.new(@unit, @atomic_moves)

      @success = @validations.all? do |validation|
        @unit.send(validation, @atomic_moves)
      end

      execute if @success
    end
    
    def front_end_move_result
      {
        path: @path,
        success: @success,
        moved_unit: @unit,
        new_squares: [from_square, to_square].map(&:to_hash)
      }
    end  
    
    private

    def game
      @unit.square.game
    end

    def execute
      target_unit = to_square.send(@unit.type.pluralize.to_sym).first
      target_unit.strength += @unit.strength
      target_unit.moves = [target_unit.moves, @unit.moves].min
      target_unit.save
      @unit.delete
    end

    def from_square
      @atomic_moves.first.from_square
    end

    def to_square
      @atomic_moves.last.to_square
    end
  end
end