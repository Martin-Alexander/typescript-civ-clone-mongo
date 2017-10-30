module GameLogic
  def move(from, to)
    unless find_square(from).player.zero?
      find_square(to).update!(player: find_square(from).player)
      find_square(from).update!(player: 0)
    end
    return [find_square(from).to_json, find_square(to).to_json]
  end
end