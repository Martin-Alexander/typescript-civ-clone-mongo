module Movement
  # Represents a move from one square to an adjacent square
  class AtomicMove
    attr_reader :unit, :from_square, :to_square

    def initialize(unit, from_square, to_square)
      @unit = unit
      @from_square = from_square
      @to_square = to_square
    end

    def cost
      connected_by_a_road? ? Rules.move_cost_of_roads : Rules.move_cost_of_square(@to_square)
    end
    
    private

    def connected_by_a_road?
      [@from_square, @to_square].all? { |square| square.complete_structure?("road") }
    end
  end
end