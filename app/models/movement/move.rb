# NOT IN USE

module Movement
  # Represents a move by a unit along a given path within a single turn
  class Move
    attr_reader :unit, :coordinate_path

    def initialize(unit, coordinate_path)
      @unit = unit
      @coordinate_path = coordinate_path

      initialize_coordinate_path_as_atomic_move_array
    end

    private

    def initialize_coordinate_path_as_atomic_move_array
      # TODO: Convert each consecutice pair of coordinates into AtomicMoves
    end
  end
end