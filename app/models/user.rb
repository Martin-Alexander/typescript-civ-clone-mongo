class User < MongoidModel
  devise :database_authenticatable, :registerable,
         :rememberable, authentication_keys: [:username]

  field :username, type: String, default: ""
  field :encrypted_password, type: String, default: ""
  field :remember_created_at, type: Time

  def email_required?; false; end
  def email_changed?; false; end

  has_many :players

  # ==== Methods that return games ====

  # Returns an array of games the user is in (filter by game state, player role, and player host)
  def games(filters = {})
    filtered_games = filters[:game_state] ? Game.where(state: filters[:game_state]) : Game.all
    filtered_games.to_a.each_with_object([]) do |game, array|
      game.players.each do |player|
        if player.user == self &&
        (filters[:role].nil? || player.role == filters[:role]) && 
        (filters[:host].nil? || player.host == filters[:host])
          array << game 
          break
        end
      end
    end
  end

  # Returns the ongoing game the user is in (if any)
  def ongoing_game
    games(game_state: "ongoing", role: "player").any? ? games(game_state: "ongoing", role: "player")[0] : false
  end

  # Returns the lobby that the user is in (if any)
  def lobby
    games(game_state: "lobby").any? ? games(game_state: "lobby")[0] : false
  end

  # ==== Methods that return players ====

  # For a given game returns the user's player
  def player_of_game(game)
    game.player(self)
  end

  # Returns the user's player that's in a lobby (if any)
  def player_in_lobby
    lobby.player(self) rescue false
  end

  # Returns the users's player that's in an ongoing game (if any)
  def player_in_ongoing_game
    ongoing_game.player(self) rescue false
  end

  # ==== Validation methods ====

  # Is the user in a specific game (filter)
  def in_game?(game)
    games.include?(game)
  end

  # Can the user join a given game
  def can_join_game?(game)
    game.state == "lobby" &&
    game.number_of_players(role: "player") < Game.max_players &&
    games(game_state: "ongoing").empty? &&
    games(game_state: "lobby").empty?
  end

  # ==== Action methods ====

  # Creates a new game with the user as a player and 
  def create_game
    new_game = Game.create(state: "lobby")
    Player.create(user: self, game: new_game, role: "player", host: true)
    new_game
  end

  # Creates a new player for a given game
  def join_game(game)
    Player.create!(user: self, game: game) 
  end

  # Changes player role to 'dead_player'
  def resign(game = ongoing_game)
    game.player(self).update(role: "dead_player")
  end

  # Removes to user from the lobby they're in
  def leave_lobby
    if lobby
      game = lobby
      if game.number_of_players == 1
        game.destroy!
      elsif game.host == self
        game.player(self).destroy
        Player.where(game: game).first.update! host: true
      else
        game.player(self).destroy
      end
      true
    else
      false
    end
  end
end
