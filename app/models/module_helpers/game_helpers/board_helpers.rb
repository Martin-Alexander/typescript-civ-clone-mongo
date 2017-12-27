module BoardHelpers
  # Takes either a square number or a column row number pair and returns the corresponding square
  def find_square(col, row = false)
    if col.respond_to?(:keys) 
      row = col[:y] || col["y"]
      col = col[:x] || col["x"]
    end
    if row && (row > board_size || col > board_size)
      raise ArgumentError, "Invalid row #{row} or col #{col} for board size of #{board_size}"
    end
    if row
      squares[row * (board_size + 1) + col]
    else
      squares[col.to_i]
    end
  end

  # Iterated through each unit and passes to a block
  def each_unit
    squares.each do |square|
      square.units.each do |unit|
        yield(unit)
      end
    end
  end
end