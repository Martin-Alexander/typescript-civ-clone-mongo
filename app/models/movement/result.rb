module Movement
  class Result
    attr_accessor :new_squares, :success, :path, :moves, :go_to, :order

    def initialize(attributes = {})
      @unit = attributes[:unit]
      @to_square = @unit.square

      @moves_left = @unit.moves
      @go_to_path = []
      @new_order = @unit.order

      @new_squares = []
      @sucess = false
      @immediate_path = []
    end

    # Returns a hash ready for the front-end
    def to_hash
      {
        move_unit: @unit,
        new_squares: @new_squares.map(&:to_hash),
        success: @success,
        path: @immediate_path.map(&:coordinates)
      }
    end

    def execute(moves)
      @success = true
      walk_path(moves)
      prepend_with_starting_square
      calculate_move_to_square_and_new_order
      update_database
    end

    # This is called when a move is not valid
    def clear_orders_and_path
      @new_order = "none"
      update_database
    end

    private

    # Actually updates the database with new move
    def update_database
      new_unit = @unit.dup
      @to_square.send(@unit.type.pluralize.to_sym).send(:push, new_unit)
      new_unit.update(
        moves: @moves_left,
        go_to: @go_to_path.map(&:coordinates),
        order: @new_order
      )
      @unit.delete

      @unit = new_unit
    end

    # Iterates over the move list provided by the move order and updates the
    # goto path and the immediate move path accordingly based on number of
    # remaining moves
    def walk_path(moves)
      out_of_moves = false

      moves.each do |move|
        out_of_moves = move.cost > @moves_left || out_of_moves

        if out_of_moves
          @go_to_path << move.to_square
        else
          @moves_left -= move.cost
          @immediate_path << move.to_square
        end
      end
    end

    # For path to move list conversion the starting square must be prepended
    # to the move appropriate move list
    def prepend_with_starting_square
      if @immediate_path.any?
        @immediate_path.prepend(@unit.square)
        @go_to_path.prepend(@immediate_path.last) if @go_to_path.any?
      elsif @go_to_path.any?
        @go_to_path.prepend(@unit.square)
      end
    end

    # Calcuation the square the unit will land on and it's new order state
    def calculate_move_to_square_and_new_order
      @to_square = calculate_move_to_square
      @new_order = calculate_new_order
      @new_squares = [@unit.square, @to_square]
    end

    # Calculating the move-to square
    def calculate_move_to_square
      if @immediate_path.any? && @go_to_path.any?
        @immediate_path.last
      elsif @immediate_path.any? && @go_to_path.empty?
        @immediate_path.last
      else
        @to_square
      end
    end

    # Calculating the new order
    def calculate_new_order
      if @immediate_path.any? && @go_to_path.any?
        "go"
      elsif @go_to_path.empty?
        "none"
      else
        "go"
      end
    end
  end
end
