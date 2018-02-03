# Mongo active record model for game

class Game < MongoidModel
  include Math

  direct_children :players, :squares

  has_many :players
  embeds_many :squares, class_name: 'Square::Global'

  field :state, type: String
  field :size, type: Integer, default: 0

  validates :state, inclusion: { in: %w([lobby ongoing over paused]) }

  # Returns a hash of game data that is prepared for the client
  def client_game_data(current_user)
    game_data = to_hash

    game_data[:players].map! do |player|
      if player[:user_id] == current_user.id
        player[:current_player] = true
        player[:user_id] = player[:user_id].to_s
        player[:game_id] = player[:game_id].to_s
        player
      else
        {
          user_id: player[:user_id].to_s,
          game_id: player[:game_id].to_s,
          number: player[:number],
          host: player[:host],
          role: player[:role],
          turn_over: player[:turn_over],
          current_player: false
        }
      end
    end

    game_data
  end

  # ==== Game logic ====

  # Handles all game logic related to turn roll-over
  def next_turn
    move_results = []
    units.each do |unit|
      move_results << unit.apply_turn_rollover_logic
    end

    players.each(&:apply_turn_rollover_logic)

    move_results
  end

  # Returns whether or not all players are ready'd up
  def all_players_ready_for_next_turn
    true
    # players.all? { |player| player.turn_over }
  end

  # Returns a list of players who are ready'd up
  def who_is_ready_for_next_turn
    players.each_with_object([]) do |player, output|
      output << { number: player.number, turn_over: player.turn_over }
    end
  end

  # ==== Board helpers ====

  # Takes either a square number or a column row number pair and returns the
  # corresponding square
  def find_square(col, row = false)
    if col.respond_to?(:keys)
      row = col[:y] || col['y']
      col = col[:x] || col['x']
    end
    row ? squares[row * (board_size + 1) + col] : squares[col.to_i]
  end

  # Iterated through each unit and passes to a block
  def each_unit
    squares.each do |square|
      square.units.each do |unit|
        yield(unit)
      end
    end
  end

  # Returns an array of all units on the board
  def units
    all_units = []

    each_unit do |unit|
      all_units << unit
    end

    all_units
  end

  # ==== Lobby methods ====

  # Maximum number of players to a game
  def self.max_players
    6
  end

  # Returns all games that're in the 'lobby state'
  def self.all_lobbies
    Game.where(state: 'lobby')
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

  # Returns whether or not the game has the right number/type of players for
  # game to start
  def ready_to_start?
    number_of_players(role: 'player') > 1
  end

  # Updates game state to 'ongoing'
  def start
    update!(state: 'ongoing')
  end

  # Generates game and initialize players
  def generate_game_data
    update!(size: board_size)
    board = Board.new(board_size)

    set_player_numbers
    generate_global_squares(board)
    create_starting_player_locations(board)
  end

  # ==== Board setup ===

  # Returns the dimension on the board such that each players "gets" 72 squares
  def board_size
    number_of_non_observer_players = number_of_players(role: 'player')
    + number_of_players(role: 'dead_player')
    sqrt(number_of_non_observer_players * 750).to_i
  end

  private

  # Generates global squares based on terrain generation of the Board class
  def generate_global_squares(board)
    board.squares.each do |square|
      Square::Global.create(
        x: square.x,
        y: square.y,
        board: self,
        terrain: square.terrain
      )
    end
  end

  # Attempts to set starting player locations as fairly as possible
  def create_starting_player_locations(board)
    player_starting_locations = board.player_starting_locations(number_of_players(role: 'player'))

    player_starting_locations.each_with_index do |square, i|
      find_square(square.x, square.y).create_worker player_number: i + 1
    end
  end

  # Initializes game players
  def set_player_numbers
    players.each_with_index do |player, i|
      player.update(number: i + 1)
    end
  end
end
