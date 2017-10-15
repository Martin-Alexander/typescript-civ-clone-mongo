class User
  include Mongoid::Document

  devise :database_authenticatable, :registerable,
         :rememberable, authentication_keys: [:username]

  field :username,              type: String, default: ""
  field :encrypted_password, type: String, default: ""
  field :remember_created_at, type: Time

  def email_required?; false; end
  def email_changed?; false; end

  has_many :players

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

  # Is the user in a specific game (filter)
  def in_game?(game)
    games.include?(game)
  end

  # Creates a new player for a given game
  def join_game(game)
    Player.create!(user: self, game: game) 
  end

  # Can the user join a given game
  def can_join_game?(game)
    game.state == "lobby" &&
    game.number_of_players(role: "player") < Game.max_players &&
    games(game_state: "ongoing").empty? &&
    games(game_state: "lobby").empty?
  end

  # Removes to user from the lobby they're in
  def leave_lobby
    if lobby
      game = lobby
      if game.number_of_players == 1
        game.destroy!
      elsif game.host == self
        Player.where(user: self, game: game).destroy!
        Player.where(game: game).first.update! host: true
      else
        Player.where(user: self, game: game).destroy!
      end
      true
    else
      false
    end
  end

  # Returns the lobby that the user is in (if any)
  def lobby
    games(game_state: "lobby").any? ? games(game_state: "lobby")[0] : false
  end
end
