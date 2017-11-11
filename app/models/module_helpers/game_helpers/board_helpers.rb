module BoardHelpers
  # Takes either a square number or a column row number pair and returns the corresponding square
  def find_square(col, row = false)
    if row && (row > board_size || col > board_size)
      raise ArgumentError, "Invalid row #{row} or col #{col} for board size of #{board_size}"
    end
    if row
      squares[row * (board_size + 1) + col]
    else
      squares[col.to_i]
    end
  end
end