module GameModules
  module NextTurn
    # Handles all game logic related to turn roll-over
    def next_turn
      update(turn: turn + 1)

      move_animations = update_all_squares(GameResources.new(self))
      update_all_players(GameResources.new(self))
      
      move_animations
    end
    
    def update_all_players(game_resources)
      players.each do |player|
        player.update!({
          turn_over: false,
          supply: game_resources.player(player).supply,
          military_count: game_resources.player(player).unit_count,
          growth: game_resources.player(player).growth
        })
      end
    end
    
    def update_all_squares(game_resources)
      structures.each { |structure| structure.apply_turn_rollover_logic(game_resources) }
      units.map(&:apply_turn_rollover_logic)
    end
    
    class GameResources
      attr_reader :player_resources

      class PlayerResources
        attr_accessor :player, :supply, :production, :growth, :unit_count

        def initialize(player)
          @player = player
          @supply = 0
          @production = 0
          @growth = player.growth

          # @military_count = 0
          # @civilian_count = 0
          @unit_count = 0
        end
      end

      def initialize(game)
        @game = game
        @player_resources = @game.players.map { |player| PlayerResources.new(player) }
        
        calculate_all_player_resources
      end

      # Get the resources of a given player by number of object
      def player(criteria)
        if criteria.is_a?(Integer)
          @player_resources.find { |player_resource| player_resource.player.number == criteria }
        else
          @player_resources.find { |player_resource| player_resource.player == criteria }
        end
      end

      private
      
      # Fills out the properties all all player resources
      def calculate_all_player_resources
        growth
        @game.squares.each do |square|
          supply_and_production(square)
          unit_count(square)
        end
      end

      # Returns a player resource given a player number
      def player_resource(player_number)
        @player_resources.find { |player_resource| player_resource.player.number == player_number }
      end

      # Calculates each players growth
      def growth
        if @game.turn % Rules.raw["turns_for_growth"] == 0
          @player_resources.each { |player_resource| player_resource.growth += 1 }
        end
      end

      # Calculates unit (military/civilian) counter for a given square
      def unit_count(square)
        square.units.each do |unit|
          player_resources = player_resource(unit.player_number)
          # if unit.type == "worker"
          #   player_resources.civilian_count += 1
          # else
          #   player_resources.military_count += 1
          # end
          player_resources.unit_count += unit.supply_cost
        end
      end

      # Calculates supply and production for a given square
      def supply_and_production(square)
        city = square.cities.first
        if city
          player_resources = player_resource(city.player_number)
          player_resources.supply += Rules.raw["supply_per_city_size"]
          player_resources.production += 1
        end
      end
    end
  end
end
