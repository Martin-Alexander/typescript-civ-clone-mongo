class NonCombatUnit < BaseUnit
  include Mongoid::Document

  embedded_in :global_square
end