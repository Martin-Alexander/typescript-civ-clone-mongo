module Movement
  # Represents a move by a unit along a given path within a single turn
  class TurnMove
    attr_reader :unit, :coordinate_path, :atomic_moves

    def initialize(unit, atomic_moves = [])
      @unit = unit
      @atomic_moves = atomic_moves
    end

    def total_move_cost
      @atomic_moves.map(&:cost).reduce(&:+)
    end

    def add_atomic_move(atomic_move)
      @atomic_moves << atomic_move
    end

    def coordinate_path
      return [] if @atomic_moves.empty?

      from_squares = @atomic_moves.map do |atomic_move| 
        atomic_move.from_square.coordinates
      end

      from_squares << @atomic_moves.last.to_square.coordinates
    end
  end
end