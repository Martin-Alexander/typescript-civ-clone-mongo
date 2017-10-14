class Game
  include Mongoid::Document

  has_many :players
end