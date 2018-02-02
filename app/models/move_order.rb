# Goal of the MoveOder class is to take in a unit and a move order
# and, based on game logic, return all the necessary information for 
# move execution and for front end rendering of the move

class MoveOrder
  def initialize(game, path)
    @game = game

    @game.find_square(path[0])

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

  class Move
    attr_reader :game, :from, :to

    def initialize(game, from, to)
      @game = game
      @from = @game.find_square(from)
      @to = @game.find_square(to)
      # @connection = connection_type
    end

    def cost
      Rules["terrain"][@to.terrain]["move_cost"]
    end
  end
end