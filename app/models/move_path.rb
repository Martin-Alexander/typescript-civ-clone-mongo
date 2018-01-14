class MovePath
  attr_reader :moves, :game, :path

  def initialize(game, path)
    @game = game
    @moves = []
    @path = []

    path.each_with_index do |square, i|
      @path << square
      if path[i + 1]
        @moves << Move.new(game, square, path[i + 1])
      end
    end
  end

  def total_move_cost
    @moves.sum { |move| move.cost }
  end

  # Pass all missing methods to moves array
  # def method_missing(method, *args, &block)
  #   if args.any?
  #     if block
  #       @moves.send(method, args, &block)
  #     else
  #       @moves.send(method, args)
  #     end
  #   else
  #     if block
  #       @moves.send(method, &block)
  #     else
  #       @moves.send(method)
  #     end
  #   end
  # rescue
  #   super(method, args, block)
  # end

  class Move
    attr_reader :game, :from, :to

    def initialize(game, from, to)
      @game = game
      @from = @game.find_square(from)
      @to = @game.find_square(to)
      # @connection = connection_type
    end

    def cost
    # def cost(unit)
      # GameRule.terrain_move_cost(unit, @to, @connection)
      1
    end

    # private

    # def connection_type
    # end
  end
end