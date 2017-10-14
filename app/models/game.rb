class Game
  include Mongoid::Document

  has_many :players

  field :state, type: String
  
  validates :state, inclusion: { in: ["lobby", "ongoing", "over", "paused"] }
end