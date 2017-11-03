module BoardHelpers
  def find_square(col, row = false)
    if row
      squares[row * board.board_size + col]
    else
      squares[col.to_i]
    end
  end
end