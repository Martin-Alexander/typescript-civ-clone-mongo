module Structure
  class City < Base
    field :production, type: String, default: "nothing"
    field :size, type: Integer, default: 1

    def apply_turn_rollover_logic
      return false if production == "nothing"

      square.create_unit(production, player_number: player_number)
    end
  end
end