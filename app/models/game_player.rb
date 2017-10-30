class GamePlayer
  include Mongoid::Document

  embedded_in :game
  embeds_many :vision_squares, class_name: "Square::Vision"

  field :number, type: Integer

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