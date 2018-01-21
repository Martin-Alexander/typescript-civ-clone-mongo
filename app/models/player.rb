class Player < MongoidModel
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

  direct_children :vision_squares
  embeds_many :vision_squares, class_name: "Square::Vision"

  field :number,         type: Integer
  field :turn_over,      type: Boolean, default: false
  field :growth,         type: Integer, default: 1
  field :supply,         type: Integer, default: 0
  field :military_count, type: Integer, default: 0
  field :civilian_count, type: Integer, default: 0

  # Searches through every square on the board and collects all units belonging
  # to the player
  def units
    game.squares.each_with_object([]) do |square, collection|
      square.units.each do |unit|
        collection << unit if unit.player_number == number
      end
    end
  end

  def toggle_turn_over
    update(turn_over: !turn_over)
  end

  def apply_turn_rollover_logic
    update(turn_over: false)
  end  
  
end