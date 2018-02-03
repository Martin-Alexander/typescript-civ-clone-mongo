# Mongo active record model for game
class Game < MongoidModel
  include Math

  include GameModules::Setup
  include GameModules::Lobby
  include GameModules::Logic
  include GameModules::ClientData

  direct_children :players, :squares

  has_many :players
  embeds_many :squares, class_name: "Square::Global"

  field :state, type: String
  field :size, type: Integer, default: 0

  validates :state, inclusion: { in: %w([lobby ongoing over paused]) }
end
