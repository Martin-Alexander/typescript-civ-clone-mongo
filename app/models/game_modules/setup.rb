module GameModules
  module Setup
    # Generates game and initialize players
    def generate_game_data
      update!(size: caluculate_board_size)
      board = Board.new(size)

      set_player_numbers
      generate_global_squares(board)
      create_starting_player_locations(board)
    end

    # Returns the dimension on the board
    def caluculate_board_size
      number_of_players = player_count(role: "player") + player_count(role: "dead_player")
      sqrt(number_of_players * Rules.space_per_player).to_i
    end

    private

    # Generates global squares based on terrain generation of the Board class
    def generate_global_squares(board)
      board.squares.each do |square|
        squares << Square::Global.new(
          x: square.x,
          y: square.y,
          terrain: square.terrain
        )
      end

      save
    end

    # Attempts to set starting player locations as fairly as possible
    def create_starting_player_locations(board)
      locations = board.player_starting_locations(player_count(role: "player"))

      locations.each_with_index do |square, i|
        starting_square = find_square(square.x, square.y)
        starting_square.create_worker player_number: i + 1
        starting_square.create_infantry player_number: i + 1
        starting_square.create_city player_number: i + 1, complete: true, size: 5
      end
    end

    # Initializes game players
    def set_player_numbers
      players.each_with_index do |player, i|
        player.update(number: i + 1)
      end
    end
  end
end
