module Square
  class Base < MongoidModel
    field :x, type: Integer
    field :y, type: Integer

    # Returns GamePlayer if vision square or Game if global square
    def game
      _parent
    end

    # For a given redius returns an array of squares within it
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
end