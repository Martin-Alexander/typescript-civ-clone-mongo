class MovePath
  attr_reader :moves, :game

  def initialize(game, path)
    @game = game
    @moves = []
    path.each_with_index do |move, i|
      if path[i + 1]
        @moves << Move.new(game, move, path[i + 1])
      end
    end
  end

  def total_move_cost
    @moves.sum { |move| move.move_cost }
  end

  # Pass all missing methods to moves array
  def method_missing(method, *args, &block)
    if args.any?
      if block
        @moves.send(method, args, &block)
      else
        @moves.send(method, args)
      end
    else
      if block
        @moves.send(method, &block)
      else
        @moves.send(method)
      end
    end
  rescue
    super
  end

  class Move
    attr_reader :game, :from, :to

    def initialize(game, from, to)
      @game = game
      @from = @game.find_square(from)
      @to = @game.find_square(to)
      # @connection = connection_type
    end

    def move_cost
    # def move_cost(unit)
      # GameRule.terrain_move_cost(unit, @to, @connection)
      1
    end

    # private

    # def connection_type
    # end
  end
end