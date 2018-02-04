module Movement
  class Order
    # Represents a move from one square to another
    class Move
      attr_reader :unit, :from, :to

      def initialize(unit, from, to)
        @unit = unit
        @from = from
        @to = to
      end

      def cost
        Rules["terrain"][@to.terrain]["move_cost"]
      end
    end
  end
end
