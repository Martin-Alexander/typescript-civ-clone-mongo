module Movement
  class GoToTurnMoves
    attr_reader :turn_moves

    def initialize(turn_moves)
      @turn_moves = turn_moves
    end

    def atomic_moves
      @turn_moves.map(&:atomic_moves).flatten
    end

    def coordinate_path
      return [] if atomic_moves.empty?

      from_squares = atomic_moves.map do |atomic_move| 
        atomic_move.from_square.coordinates
      end

      from_squares << atomic_moves.last.to_square.coordinates      
    end
  end
end