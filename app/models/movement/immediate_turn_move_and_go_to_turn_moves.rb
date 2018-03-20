module Movement
  module ImmediateTurnMoveAndGoToTurnMovesClassMethods
    def self.included(base)
      base.extend(ClassMethods)
    end

    module ClassMethods
      def build(unit, atomic_moves)
        new(unit, atomic_moves).results
      end
    end
  end

  class ImmediateTurnMoveAndGoToTurnMoves
    class ImmediateTurnMoveAndGoToTurnMovesResults
      attr_reader :immediate_turn_move, :go_to_turn_moves, :remaining_moves

      def initialize(immediate_turn_move, go_to_turn_moves, remaining_moves)
        @immediate_turn_move = immediate_turn_move
        @go_to_turn_moves = GoToTurnMoves.new(go_to_turn_moves)
        @remaining_moves = remaining_moves
      end
    end

    include ImmediateTurnMoveAndGoToTurnMovesClassMethods

    def initialize(unit, atomic_moves)
      @unit = unit
      @atomic_moves = atomic_moves

      @go_to_turn_moves = []
      @immediate_turn_move = TurnMove.new(@unit)

      @has_ran_out_of_moves = false
      @moves_available_to_unit = @unit.moves
      @cummulative_cost_of_atomic_moves = 0

      build
    end

    def results
      ImmediateTurnMoveAndGoToTurnMovesResults.new(
        @immediate_turn_move,
        @go_to_turn_moves,
        remaining_moves
      )
    end

    private

    def build
      @atomic_moves.each do |atomic_move|
        @cummulative_cost_of_atomic_moves += atomic_move.cost
        if out_of_moves?
          add_to_go_to_turn_move(atomic_move)
        else
          add_to_immediate_turn_move(atomic_move)
        end
      end
    end

    def out_of_moves?
      @has_ran_out_of_moves || (@cummulative_cost_of_atomic_moves > @moves_available_to_unit)
    end

    def add_to_go_to_turn_move(atomic_move)
      @has_ran_out_of_moves = true
      if can_create_new_go_to_turn_move?(atomic_move)
        @go_to_turn_moves << TurnMove.new(@unit, [atomic_move])
      else
        @go_to_turn_moves.last.add_atomic_move(atomic_move)
      end
    end

    def add_to_immediate_turn_move(atomic_move)
      @immediate_turn_move.add_atomic_move(atomic_move)
    end

    def can_create_new_go_to_turn_move?(atomic_move)
      @go_to_turn_moves.empty? || 
      @go_to_turn_moves.last.total_move_cost + atomic_move.cost > Rules.base_movement_rate(@unit)
    end

    def remaining_moves
      @has_ran_out_of_moves ? 0 : @moves_available_to_unit - @cummulative_cost_of_atomic_moves
    end
  end
end
