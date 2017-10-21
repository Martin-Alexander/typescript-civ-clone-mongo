class CombatUnit < BaseUnit
  include Mongoid::Document

  embedded_in :global_square
end