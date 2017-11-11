class Game
  include Mongoid::Document
  include BoardSetup
  include BoardHelpers
  include GameLogic
  include Lobby

  has_many :players
  embeds_many :game_players
  embeds_many :squares, class_name: "Square::Global"

  field :state, type: String
  field :size, type: Integer, default: 0

  validates :state, inclusion: { in: ["lobby", "ongoing", "over", "paused"] }
end