class Game
  include Mongoid::Document
  include BoardGeneration

  has_many :players
  embeds_many :game_players
  embeds_many :squares, class_name: "Square::Global"

  field :state, type: String

  validates :state, inclusion: { in: ["lobby", "ongoing", "over", "paused"] }

  # Maximum number of players to a game
  def self.max_players
    6
  end

  # Returns the dimension on the board such that each players "gets" 72 squares
  def board_size
    Math::sqrt(number_of_players(role: "player") * 72).to_i
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

  # Returns whether or not the game has the right number/type of players for game to start
  def ready_to_start?
    number_of_players(role: "player") > 1
  end

  # Updates game state to 'ongoing'
  def start
    update!(state: "ongoing")
  end

  # Generates a blank board based on setting
  # TEST MODE
  def generate_game_data
    generate_global_squares
    generate_game_players
    generate_vision_squares
    generate_initial_player_placement
  end
end