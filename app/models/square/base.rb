module Square
  class Base
    include Mongoid::Document

    field :x, type: Integer
    field :y, type: Integer

    def game
      _parent
    end

    def neighbours(radius)
      (0..radius).each_with_object([]) do |x, array|
        (0..radius).each do |y|
          unless (x.zero? && y.zero?) ||
          x < 0 || y < 0 || 
          x >= game.board_size ||
          y >= game.board_size
            array << game.find_square(x, y)
        end
      end
    end
  end
end