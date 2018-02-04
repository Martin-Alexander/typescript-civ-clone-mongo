module Movement
  # Represents a move from one square to another
  class Move
    attr_reader :unit, :from, :to

    def initialize(unit, from, to)
      @unit = unit
      @from = from
      @to = to
    end

    # TODO: consider whether or not the from and to squares are connected by
    #       a road
    def cost
      Rules["terrain"][@to.terrain]["move_cost"]
    end
  end
end
