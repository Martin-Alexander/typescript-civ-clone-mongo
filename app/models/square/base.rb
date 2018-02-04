module Square
  class Base < MongoidModel
    field :x, type: Integer
    field :y, type: Integer

    # Returns GamePlayer if vision square or Game if global square
    def game
      _parent
    end

    # For a given redius returns an array of squares within it
    def neighbours(radius = 1)
      (-radius..radius).each_with_object([]) do |x_diff, array|
        (-radius..radius).each do |y_diff|
          next if (x_diff.zero? && y_diff.zero?) ||
                  x_diff + x < 0 ||
                  y_diff + y < 0 ||
                  x_diff + x > game.size ||
                  y_diff + y > game.size
          array << game.find_square(x_diff + x, y_diff + y)
        end
      end
    end
  end

  def coordinates
    { x: x, y: x }
  end
end
