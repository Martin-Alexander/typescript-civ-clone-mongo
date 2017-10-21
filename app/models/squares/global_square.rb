class GlobalSquare < BaseSquare
  include Mongoid::Document

  embedded_in :game
  embeds_many :non_combat_units
  embeds_many :combat_units
end