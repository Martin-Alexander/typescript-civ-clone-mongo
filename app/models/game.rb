class Game < MongoidModel
  direct_children :game_players, :squares

  has_many :players
  embeds_many :game_players
  embeds_many :squares, class_name: "Square::Global"

  field :state, type: String
  field :size, type: Integer, default: 0

  validates :state, inclusion: { in: ["lobby", "ongoing", "over", "paused"] }

  # Returns a hash of game data that is prepared for the client
  def client_game_data(current_user)
    game_data = to_hash

    game_data[:game_players].map! do |game_player|
      if game_player[:user_id] == current_user.id.to_s
        game_player[:current_player] = true
        game_player
      else
        { 
          user_id: game_player[:user_id], 
          number: game_player[:number],
          current_player: false
        }
      end
    end

    game_data
  end

  # ==== Game logic ====

  # Handles all game logic related to turn roll-over
  def next_turn
    each_unit do |unit|
      unit.apply_turn_rollover_logic
    end
  end

  # ==== Board helpers ====

  # Takes either a square number or a column row number pair and returns the corresponding square
  def find_square(col, row = false)
    if col.respond_to?(:keys) 
      row = col[:y] || col["y"]
      col = col[:x] || col["x"]
    end
    if row && (row > board_size || col > board_size)
      raise ArgumentError, "Invalid row #{row} or col #{col} for board size of #{board_size}"
    end
    if row
      squares[row * (board_size + 1) + col]
    else
      squares[col.to_i]
    end
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
    # generate_vision_squares
    generate_initial_unit_placement
  end  

  # ==== Board setup ===

  # Returns the dimension on the board such that each players "gets" 72 squares
  def board_size
    Math::sqrt(number_of_players(role: "player") * 500).to_i
  end
  
  private

  # Generates global squares
  def generate_global_squares
    update!(size: board_size)
    (0..size).each do |y_coord|
      (0..size).each do |x_coord|
        Square::Global.create x: x_coord, y: y_coord, board: self
      end
    end
  end

  # Generates game players
  def generate_game_players
    players.each_with_index do |player, i|
      GamePlayer.create game: self, number: i + 1, user_id: player.user_id.to_s
    end
  end

  # Generates vision squares for each game player
  def generate_vision_squares
    game_players.each do |game_player|
      squares.each do |square|
        Square::Vision.create! x: square.x, y: square.x, board: game_player
      end
    end
  end

  # Generates initlia player placement
  def generate_initial_unit_placement
    game_players.each do |game_player|
      loop do 
        selected_square = squares.sample
        if selected_square.units.empty?
          selected_square.create_worker player_number: game_player.number
          break
        end
      end 
    end
  end  

  public



end