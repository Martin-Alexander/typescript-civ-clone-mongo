module GameModules
  module Lobby
    def self.included(base)
      base.extend(ClassMethods)
      base.include(InstanceMethods)
    end

    # Class methods for game lobby
    module ClassMethods
      # Maximum number of players to a game
      def max_players
        6
      end

      # Returns all games that're in the 'lobby state'
      def all_lobbies
        Game.where(state: "lobby")
      end
    end

    # Class methods for game lobby
    module InstanceMethods
      # Returns the number of players (filter by role)
      def player_count(filters = {})
        players.count do |player|
          filters[:role].nil? || filters[:role] == player.role
        end
      end

      # Returns the player for a given user
      def player(user)
        players.select { |player| player.user == user }.first
      end

      # Returns the host of the game as a user
      def host
        players.each { |player| return player.user if player.host }
      end

      # Returns whether or not the game has the right number/type of players for
      # game to start
      def ready_to_start?
        player_count(role: "player") > 1
      end

      # Updates game state to 'ongoing'
      def start
        update!(state: "ongoing")
      end
    end
  end
end
