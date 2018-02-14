module Structure
  class City < Base
    field :production, type: String, default: "nothing"
    field :size, type: Integer, default: 1

    def apply_turn_rollover_logic(player_resources)
      if production == "nothing" || player_resources[player_number][:unit_count] >= player_resources[player_number][:supply]
        return false 
      end

      square.create_unit(production, player_number: player_number)
      player_resources[player_number][:unit_count] -= 1
    end
  end
end