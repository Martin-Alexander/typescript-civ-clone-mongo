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

  def games
    Game.all.to_a.each_with_object([]) do |game, array|
      game.players.each do |player|
        if player.user == self
          array << game 
          break
        end
      end
    end
  end

  def in_game?(game, game_state_criteria = false)
    if game_state_criteria
      games.select { |game| game.state == game_state_criteria }.include?(game)
    else
      games.include?(game)
    end
  end
end
