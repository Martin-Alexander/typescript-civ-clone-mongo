class GamePlayer
  include Mongoid::Document

  embeds_many :vision_squares
end