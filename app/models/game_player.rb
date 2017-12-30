class GamePlayer < MongoidModel
  direct_children :vision_squares

  embedded_in :game
  embeds_many :vision_squares, class_name: "Square::Vision"

  field :number, type: Integer
  field :user_id, type: String

  field :growth, type: Integer, default: 1
  field :supply, type: Integer, default: 0
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
end