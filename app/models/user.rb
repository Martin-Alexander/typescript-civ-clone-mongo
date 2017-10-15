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
      filtered_players = filters[:role] ? game.players.select { |player| player.role == filters[:role]} : game.players
      filtered_players = filters[:host].nil? ? filtered_players : filtered_players.select { |player| player.host == filters[:host] }
      filtered_players.each do |player|
        if player.user == self
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
end
