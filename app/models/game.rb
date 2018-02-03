# Mongo active record model for game
class Game < MongoidModel
  include Math

  include Game::Setup
  include Game::Lobby
  include Game::Logic
  include Game::ClientData

  direct_children :players, :squares

  has_many :players
  embeds_many :squares, class_name: 'Square::Global'

  field :state, type: String
  field :size, type: Integer, default: 0

  validates :state, inclusion: { in: %w([lobby ongoing over paused]) }
end
