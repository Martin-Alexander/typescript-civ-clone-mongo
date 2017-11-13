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
          unless (x_diff.zero? && y_diff.zero?) ||
          x_diff + x < 0 || y_diff + y < 0 || 
          x_diff + x > game.board_size ||
          y_diff + y > game.board_size
            array << game.find_square(x_diff + x, y_diff + y)
          end
        end
      end
    end

    # Returns Manhattan distance between two squares
    def distance(a, b)
      (a.x - b.x).abs + (a.y - b.y).abs
    end

    # Returns A Star value of a square
    def a_star_value(current_node, goal_square)
      current_node[:path_cost] + distance(current_node, goal_square)
    end

    # class Square
    #   attr_accessor :x, :y, :move_cost, :path_cost, :path_via
    #   def initialize(square)
    #     @x = square.x
    #     @y = square.y
    #     if square.units.any?
    #       @move_cost = 100
    #     else
    #       @move_cost = 1
    #     end
    #     @path_cost = 1 << 32
    #     @path_via = nil
    #   end

    #   def to_s
    #     "[x: #{@x}, y: #{@y}, cost: #{@path_cost}]"
    #   end

    #   def ==(other)
    #     @x == other.x && @y == other.y
    #   end
    # end

    # def a_star(destination = false)
      
    #   def a_star_go(priority_queue)
    #     highest_square = game.find_square(priority_queue.first.x, priority_queue.first.y)
    #     highest_square.neighbours.each do |neighbour|
    #       neighbour_node = Square.new(neighbour)
    #       if priority_queue.first.path_cost + neighbour_node.move_cost < neighbour_node.path_cost && neighbour_node != priority_queue.first
    #         neighbour_node.path_cost = priority_queue.first.path_cost + neighbour_node.move_cost
    #         neighbour_node.path_via = priority_queue.first
    #       end
    #       priority_queue << neighbour_node
    #     end
        
    #     priority_queue.delete_at(0)
    #     priority_queue.sort! { |a, b| a.path_cost <=> b.path_cost }

    #     byebug

    #     a_star_go(priority_queue)
    #   end
    #   start_square = Square.new(self)
    #   start_square.path_cost = 0
    #   a_star_go([start_square])
    # end
  end
end