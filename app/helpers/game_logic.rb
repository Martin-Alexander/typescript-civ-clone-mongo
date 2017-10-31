module GameLogic
  def move(from, to)
    from.units.first.move(to)
    return [from.to_json, to.to_json]
  end
end