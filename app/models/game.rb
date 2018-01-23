class Game < MongoidModel
  direct_children :players, :squares

  has_many :players
  embeds_many :squares, class_name: "Square::Global"

  field :state, type: String
  field :size, type: Integer, default: 0

  validates :state, inclusion: { in: ["lobby", "ongoing", "over", "paused"] }

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

    players.each { |player| player.apply_turn_rollover_logic }

    return move_results
  end

  def all_players_ready_for_next_turn
    players.all? { |player| player.turn_over }
  end

  def who_is_ready_for_next_turn
    players.each_with_object([]) do |player, output|
      output << { number: player.number, turn_over: player.turn_over }
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
    initialize_players
    # generate_vision_squares
    generate_initial_unit_placement
  end  

  # ==== Board setup ===

  # Returns the dimension on the board such that each players "gets" 72 squares
  def board_size
    Math::sqrt((number_of_players(role: "player") + number_of_players(role: "dead_player")) * 750).to_i
  end
  
  def generate_terrain
    board = Board.new(board_size)

    squares.each do |square|
      square.update!(terrain: board.find_square(square.x, square.y).terrain)
    end
  end
  
  private

  # Generates global squares
  def generate_global_squares
    update!(size: board_size)
    board = Board.new(board_size)

    board.squares.each do |square|
      Square::Global.create x: square.x, y: square.y, board: self, terrain: square.terrain
    end
  end

  # Initializes game players
  def initialize_players
    # players.each_with_index do |player, i|
    #   GamePlayer.create game: self, number: i + 1, user_id: player.user_id.to_s
    # end
    players.each_with_index do |player, i|
      player.update(number: i + 1)
    end
  end

  # Generates vision squares for each game player
  def generate_vision_squares
    # players.each do |player|
    #   squares.each do |square|
    #     Square::Vision.create! x: square.x, y: square.x, board: player
    #   end
    # end
  end

  # Generates initlia player placement
  def generate_initial_unit_placement
    players.each do |player|
      loop do 
        selected_square = squares.sample
        if selected_square.units.empty?
          selected_square.create_worker player_number: player.number
          break
        end
      end 
    end
  end
end