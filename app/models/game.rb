class Game
  include Mongoid::Document

  has_many :players
  embeds_many :game_players
  embeds_many :global_squares

  field :state, type: String

  validates :state, inclusion: { in: ["lobby", "ongoing", "over", "paused"] }

  # Maximum number of players to a game
  def self.max_players
    6
  end

  # Returns all games that're in the 'lobby state'
  def self.all_lobbies
    Game.where(state: "lobby")
  end

  # Returns the number of players (filter by role)
  def number_of_players(filters = {})
    counter = 0
    players.each { |player| counter += 1 if filters[:role].nil? || filters[:role] == player.role }
    counter
  end

  # Returns the player for a given user
  def player(user)
    players.select { |player| player.user == user }.first
  end

  # Returns the host of the game as a user
  def host
    players.each { |player| return player.user if player.host }
  end

  def ready_to_start?
    number_of_players(role: "player") > 1
  end

  def start
    update!(state: "ongoing")
  end
end