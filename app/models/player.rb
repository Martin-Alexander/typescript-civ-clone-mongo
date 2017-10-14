class Player
  include Mongoid::Document

  belongs_to :user
  belongs_to :game
end