module Movement
  # Goal of the MoveOder class is to take in a unit and a move order
  # and, based on game logic, return all the necessary information for
  # move execution and for front end rendering of the move
  class Order
    attr_reader :moves

    def initialize(attributes = {})
      @validations = attributes[:validations]

      @unit = attributes[:unit]
      @game = @unit.square.board

      # Contains all move objects of the move order
      @moves = []

      # All squares that have been updated in the process of executing the move
      # Needed to tell front-end which squares in memeory to replace
      @new_squares = []

      fill_moves(attributes[:path])
    end

    # Applies validations, updates database accordingly, and returns move results hash
    def execute
      move_result = Result.new(unit: @unit)
      move_result.execute(@moves) if valid_move
      move_result
    end

    private

    def valid_move
      @validations.all? do |validation|
        @unit.send(validation, @moves)
      end
    end

    def fill_moves(path)
      path.each_with_index do |coords, i|
        break if i == path.length - 1
        from_square = @game.find_square(coords)
        to_square = @game.find_square(path[i + 1])
        @moves << Move.new(@unit, from_square, to_square)
      end
    end

    def total_move_cost
      @moves.sum(&:cost)
    end
  end
end
