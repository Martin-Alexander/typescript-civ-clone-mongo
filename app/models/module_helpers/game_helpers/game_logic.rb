module GameLogic
  # Handles all game logic related to turn roll-over
  def next_turn
    each_unit do |unit|
      unit.update(moves: unit.base_moves)
    end
  end
end