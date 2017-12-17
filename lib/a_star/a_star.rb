class AStar
  # Initialize A Star object and returns results of run
  def self.run(game_object, square_objects)
    AStar.new(game_object, square_objects).run
  end

  # Initialize an A Star object that is read to be run (shouldn't be called directly)
  def initialize(game_object, square_objects)
    @board = AbstractBoard.new(game_object)
    @start = AbstractSquare.new(square_objects[:start])
    @finish = AbstractSquare.new(square_objects[:finish])
  end

  # Handle actual implementation of A Star
  def run
    closed_squares = []
    opened_squares = [@start]

    @start.current_path_cost = 0

    while opened_squares.any?
      current_square = opened_squares.sort do |a, b|
        a.estimated_total_cost(@finish) <=> b.estimated_total_cost(@finish)
      end.first

      if current_square == @finish
        return find_path(current_square)
      end

      closed_squares.push(current_square)
      opened_squares.delete(current_square)

      @board.neighbours(current_square).each do |neighbour|
        if closed_squares.include?(neighbour)
          next
        end

        if !opened_squares.include?(neighbour)
          opened_squares.push(neighbour)
        end

        if current_square.current_path_cost + neighbour.move_cost >= neighbour.current_path_cost
          next
        end

        neighbour.path_via = current_square
        neighbour.current_path_cost = current_square.current_path_cost + neighbour.move_cost   
      end
    end
  end

  def find_path(square)
    path = []
    current_square = square

    while !current_square.nil? 
      path.prepend({
        x: current_square.x,
        y: current_square.y
      })
      current_square = current_square.path_via
    end

    return path
  end
end