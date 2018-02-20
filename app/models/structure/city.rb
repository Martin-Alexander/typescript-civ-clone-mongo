module Structure
  class City < Base
    field :production, type: String, default: "nothing"
    field :size, type: Integer, default: 1

    def apply_turn_rollover_logic(game_resources)
      unit_count = game_resources.player(player_number).unit_count
      supply = game_resources.player(player_number).supply

      return false if production == "nothing" || unit_count >= supply

      square.create_unit(production, player_number: player_number)
      game_resources.player(player_number).unit_count += 1
    end

    def build
      if player.growth > 0
        super
        player.update(growth: player.growth - 1)
      end
    end

    def grow
      update(size: size + 1)
      player.update(growth: player.growth - 1)
    end
  end
end