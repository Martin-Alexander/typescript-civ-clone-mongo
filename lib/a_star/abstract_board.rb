class AbstractBoard
	attr_reader :squares

  def self.manhattan_distance(a, b)
    (a.x - b.x).abs + (a.y - b.y).abs
  end

  def initialize(game_object)
    @game = game_object
    @squares = []
    @game.squares.each do |square|
      @squares << AbstractSquare.new(square)
    end
  end

  def neighbours(square, radius = 1)
    (-radius..radius).each_with_object([]) do |x_diff, array|
      (-radius..radius).each do |y_diff|
        unless (x_diff.zero? && y_diff.zero?) ||
        x_diff + square.x < 0 || y_diff + square.y < 0 || 
        x_diff + square.x > @game.board_size ||
        y_diff + square.y > @game.board_size
          array << find_square(x_diff + square.x, y_diff + square.y)
        end
      end
    end    
  end

  private

  def find_square(x, y)
    if (x > @game.board_size || y > @game.board_size)
      raise ArgumentError, "Invalid row #{y} or col #{x} for board size of #{@game.board_size}"
    else
      @squares[y * (@game.board_size + 1) + x]
    end
  end
end