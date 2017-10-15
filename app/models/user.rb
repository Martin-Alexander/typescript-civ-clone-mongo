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
end
