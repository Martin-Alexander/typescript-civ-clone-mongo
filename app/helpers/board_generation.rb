module BoardGeneration

  private

  # Returns the dimension on the board such that each players "gets" 72 squares
  def board_size
    Math::sqrt(number_of_players(role: "player") * 72).to_i
  end
  
  # Generates global squares
  # TEST MODE
  def generate_global_squares
    update!(size: board_size)
    (0..size).each do |y_coord|
      (0..size).each do |x_coord|
        Square::Global.create x: x_coord, y: y_coord, board: self
      end
    end
  end

  # Generates game players
  # TEST MODE
  def generate_game_players
    players.each_with_index do |player, i|
      GamePlayer.create game: self, number: i + 1
    end
  end

  # Generates vision squares for each game player
  # TEST MODE
  def generate_vision_squares
    game_players.each do |game_player|
      squares.each do |square|
        Square::Vision.create! x: square.x, y: square.x, board: game_player
      end
    end
  end

  # Generates initlia player placement
  # TEST MODE
  def generate_initial_unit_placement
    game_players.each do |game_player|
      loop do 
        selected_square = squares.sample
        if selected_square.units.empty?
          selected_square.create_infantry player_number: game_player.number
          break
        end
      end 
    end
  end  
end