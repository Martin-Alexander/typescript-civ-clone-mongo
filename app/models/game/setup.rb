module Game
  # Game setup methods
  module Setup
    # Generates game and initialize players
    def generate_game_data
      update!(size: board_size)
      board = Board.new(board_size)

      set_player_numbers
      generate_global_squares(board)
      create_starting_player_locations(board)
    end

    # Returns the dimension on the board
    def board_size
      c = player_count(role: 'player') + player_count(role: 'dead_player')
      sqrt(c * 750).to_i
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
      locations = board.player_starting_locations(player_count(role: 'player'))

      locations.each_with_index do |square, i|
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
end
