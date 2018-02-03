module GameModules
  module ClientData
    # Returns a hash of game data that is prepared for the client
    def client_game_data(current_user)
      game_data = to_hash

      game_data[:players].map! do |player|
        if player[:user_id] == current_user.id
          client_current_player_data(player)
        else
          client_player_data(player)
        end
      end
    end

    private

    # Returns client ready player data of the current player
    def client_current_player_data(player)
      player[:current_player] = true
      player[:user_id] = player[:user_id].to_s
      player[:game_id] = player[:game_id].to_s
      player
    end

    # Returns client ready player data of the other players
    def client_player_data(player)
      {
        user_id: player[:user_id].to_s,
        game_id: player[:game_id].to_s,
        number: player[:number],
        host: player[:host],
        role: player[:role],
        turn_over: player[:turn_over],
        current_player: false
      }
    end
  end
end
