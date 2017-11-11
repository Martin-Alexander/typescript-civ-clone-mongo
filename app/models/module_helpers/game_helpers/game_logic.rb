module GameLogic
  # Given two squares, consults unit level game logic and returns the origin two squares
  def move(from, to)
    from.units.first.move(to)
    return [from.to_json, to.to_json]
  end
end