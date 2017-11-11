class Player < MongoidModel
  include Mongoid::Document

  belongs_to :user
  belongs_to :game

  field :role, type: String, default: "player"
  field :host, type: Boolean, default: false

  validates :role, inclusion: { in: ["player", "dead_player", "observer"] }
  validates :user, uniqueness: { scope: :game }

  # Toggle role between "player" and "observer"
  def swap_role
    if role == "player"
      update! role: "observer"
    elsif role == "observer"
      update! role: "player"
    end
  end
end