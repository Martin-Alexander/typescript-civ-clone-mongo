class Game
  include Mongoid::Document

  has_many :players

  field :state, type: String

  validates :state, inclusion: { in: ["lobby", "ongoing", "over", "paused"] }

  # Maximum number of players to a game
  def self.max_players
    6
  end

  # Returns the number of players (filter by role)
  def number_of_players(filters = {})
    counter = 0
    players.each { |player| counter += 1 if filters[:role].nil? || filters[:role] == player.role }
    counter
  end
end