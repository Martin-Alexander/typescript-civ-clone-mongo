class Player
  include Mongoid::Document

  belongs_to :user
  belongs_to :game

  field :role, type: String, default: "player"
  field :host, type: Boolean, default: false

  validates :role, inclusion: { in: ["player", "dead_player", "observer"] }
  validates :user, uniqueness: { scope: :game }
end