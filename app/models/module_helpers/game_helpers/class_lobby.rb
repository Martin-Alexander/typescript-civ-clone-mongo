module ClassLobby
  # Maximum number of players to a game
  def max_players
    6
  end

  # Returns all games that're in the 'lobby state'
  def all_lobbies
    Game.where(state: "lobby")
  end
end