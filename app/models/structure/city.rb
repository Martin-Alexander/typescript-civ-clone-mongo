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
      player = square.game.players.where(number: player_number).first
      if player.growth > 0
        super
        player.update(growth: player.growth - 1, military_count: player.military_count -= 1)
      end
    end    
  end
end