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
  
  class Board
    attr_reader :squares, :size

    def initialize(size)
      @size = size
      @squares = []

      (0..size).each do |y_coord|
        (0..size).each do |x_coord|
          @squares << Square.new(x_coord, y_coord, self)
        end
      end

      # Create some mountain roots
      ((size / 16)..(size / 8)).to_a.sample.times { squares_within(size / 4).sample.terrain = "mountains" }

      # Extend mountain roots and build mountain ranges
      size.times do
        squares.each do |square|
          if square.neighbouring_terrain("mountains") == 1 &&
          square.neighbouring_terrain("mountains", 2) < 3 &&
          square.neighbouring_terrain("mountains", 4) < 5 &&
          rand(12).zero?
            square.terrain = "mountains"
          end
        end
      end

      # Flesh out mountain ranges
      fill_in_squares = []
      2.times do 
        squares.each do |square|
          if square.terrain != "mountains"
            case square.neighbouring_terrain("mountains")
            when 0
            when 1
              fill_in_squares << square if rand(4).zero?
            when 2
              fill_in_squares << square if rand(3).zero?
            when 3
              fill_in_squares << square if rand(2).zero?
            else
              fill_in_squares << square
            end
          end
        end
      end
      fill_in_squares.each { |square| square.terrain = "mountains" }

      # Create some water roots
      ((size / 8)..(size / 4)).to_a.sample.times { squares.sample.terrain = "water" }

      # Increase water
      6.times do
        squares.each do |square|
          if square.terrain == "grass"
            case square.neighbouring_terrain("water")
            when 0
            when 1
              square.terrain = "water" if rand(5).zero?
            when 2
              square.terrain = "water" if rand(4).zero?
            when 3
              square.terrain = "water" if rand(3).zero?
            else
              square.terrain = "water" 
            end
          end          
        end
      end

      # Remove isolated water patches
      squares.each do |square|
        if square.terrain == "water" && square.neighbouring_terrain("water") < 3
          square.terrain = "grass"
        end
      end

      # Create some plains roots
      ((size / 2)..(size)).to_a.sample.times do
        square = squares.sample
        if (square.neighbouring_terrain("water", 3).zero? || rand(2).zero?) &&
        (square.neighbouring_terrain("water", 2).zero? || rand(4).zero?) &&
        (square.neighbouring_terrain("water").zero? || rand(8).zero?)
          square.terrain = "plains" 
        end
      end

      # Increase plains
      6.times do
        squares.each do |square|
          if square.terrain == "grass" && 
          (square.neighbouring_terrain("water", 3).zero? || rand(2).zero?) &&
          (square.neighbouring_terrain("water", 2).zero? || rand(4).zero?) &&
          (square.neighbouring_terrain("water").zero? || rand(8).zero?)
            case square.neighbouring_terrain("plains")
            when 0
            when 1
              square.terrain = "plains" if rand(6).zero?
            when 2
              square.terrain = "plains" if rand(5).zero?
            when 3
              square.terrain = "plains" if rand(4).zero?
            else
              square.terrain = "plains" 
            end
          end          
        end
      end
      
      # Create some desert roots
      ((size / 4)..(size)).to_a.sample.times do
        square = squares.sample
        if square.terrain == "plains" &&
        (square.neighbouring_terrain("grass", 2).zero? || rand(4).zero?) &&
        (square.neighbouring_terrain("grass").zero? || rand(8).zero?)
          square.terrain = "desert" 
        end
      end

      8.times do
        squares.each do |square|
          if square.terrain == "plains" && square.neighbouring_terrain("grass", 2).zero?
            case square.neighbouring_terrain("desert")
            when 0
            when 1
              square.terrain = "desert" if rand(4).zero?
            when 2
              square.terrain = "desert" if rand(3).zero?
            when 3
              square.terrain = "desert" if rand(2).zero?
            else
              square.terrain = "desert" 
            end
          end          
        end
      end      
    end

    def find_square(col, row = false)
      if col.respond_to?(:keys) 
        row = col[:y] || col["y"]
        col = col[:x] || col["x"]
      end
      if row && (row > size || col > size)
        raise ArgumentError, "Invalid row #{row} or col #{col} for board size of #{size}"
      end
      if row
        squares[row * (size + 1) + col]
      else
        squares[col.to_i]
      end
    end

    def squares_within(radius)
      squares.select do |square|
        (square.x - size / 2).abs <= radius && (square.y - size / 2).abs <= radius
      end
    end

    def to_s
      "<Board: size: #{@size}>"
    end

    def inspect
      "<Board: size: #{@size}>"
    end

    class Square
      attr_accessor :x, :y, :terrain, :board

      def initialize(x, y, board)
        @board = board
        @x = x
        @y = y
        @terrain = "grass"
      end

      def neighbours(radius = 1)
        (-radius..radius).each_with_object([]) do |x_diff, array|
          (-radius..radius).each do |y_diff|
            unless (x_diff.zero? && y_diff.zero?) ||
            x_diff + x < 0 || y_diff + y < 0 || 
            x_diff + x > board.size ||
            y_diff + y > board.size
              array << board.find_square(x_diff + x, y_diff + y)
            end
          end
        end
      end

      def neighbouring_terrain(terrain, radius = 1)
        neighbours(radius).select { |square| square.terrain == terrain }.length
      end
      
      def to_s
        "<Square: x: #{@x}, y: #{@y}, terrain: #{@terrain}>"
      end

      def inspect
        "<Square: x: #{@x}, y: #{@y}, terrain: #{@terrain}>"
      end
    end
  end
end