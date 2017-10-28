module GameLogic
  def move(from, to)
    unless square(from).player.zero?
      square(to).update!(player: square(from).player)
      square(from).update!(player: 0)
    end
    return [square(from).to_json, square(to).to_json]
  end
end