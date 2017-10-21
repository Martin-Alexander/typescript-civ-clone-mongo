class VisionSquare < BaseSquare
  include Mongoid::Document

  embedded_in :game_player
end