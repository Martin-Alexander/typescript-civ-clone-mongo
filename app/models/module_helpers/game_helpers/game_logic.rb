module GameLogic
  # Handles all game logic related to turn roll-over
  def next_turn
    each_unit do |unit|
      unit.apply_turn_rollover_logic
    end
  end
end