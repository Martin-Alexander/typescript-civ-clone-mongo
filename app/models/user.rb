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
    Game.all.to_a.each_with_object(Mongoid::Criteria.new(Game)) do |game, criteria|
      game.players.to_a.each { |player| criteria << game; break if player.user == self }
    end
  end
end
