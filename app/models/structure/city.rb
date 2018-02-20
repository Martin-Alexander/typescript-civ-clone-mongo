module Structure
  class City < Base
    field :production, type: String, default: "nothing"
    field :size, type: Integer, default: 1

    def apply_turn_rollover_logic(game_resources)
      return false if production == "nothing" || !enough_supply_to_produce_unit?(game_resources)

      train_units(game_resources)
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

    def train_units(game_resources)
      player_resources = game_resources.player(player_number)

      Rules.city_production_level(self).times do
        if enough_supply_to_produce_unit?(game_resources)
          square.create_unit(production, player_number: player_number)
          player_resources.unit_count += 1
        end
      end
    end

    def enough_supply_to_produce_unit?(game_resources)
      game_resources.player(player_number).unit_count < game_resources.player(player_number).supply
    end
  end
end