class GamePlayer
  include Mongoid::Document

  embedded_in :game
  embeds_many :vision_squares, class_name: "Square::Vision"

  field :number, type: Integer
end