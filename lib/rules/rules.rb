class Rules
  module ClassMethods
    class RuleError < StandardError; end

    # Returns raw hash of rules
    def raw
      YAML.safe_load(File.open(File.join(Rails.root, "config/rules.yml")))
    end

    # Returns raw hash of rules
    def rules_hash
      raw
    end

    # Given a unit, the square it one, and the player who owns it: What are it's available orders
    def allowed_orders(unit)
      case unit.type
      when "worker"
        orders_for_worker(unit)
      else
        rules_hash["units"][unit.type]["allowed_orders"]
      end
    end

    # Returns the type of a given order
    def order_type(order)
      rules_hash["orders"][order]["type"]
    end

    # Returns the structure of a given construction order
    def order_structure(order)
      validate_contruction_order!(order)
      rules_hash["orders"][order]["structure"]
    end

    # Returns the state result of a given state transform order
    def order_state(order)
      validate_state_transform_order!(order)
    end

    # For a given worker returns all its available orders based on the state of its owner and the
    # square that it's in
    def orders_for_worker(unit)
      possible_orders = rules_hash["units"]["worker"]["allowed_orders"]
      possible_orders.each_with_object([]) do |order, allowed_orders|
        unless order_type(order) != "construction" ||
           (order_type(order) == "construction" &&
           valid_contruction_order?(unit, order))
          next
        end
        allowed_orders << order
      end
    end

    # For a given city returns its production capabilities
    def city_production_level(city)
      city.size / rules_hash["production_levels"]
    end

    # Space per player on map generation
    def space_per_player
      rules_hash["space_per_player"]
    end

    private

    # For a given worker returns whether or not its contruction order is valid
    def valid_contruction_order?(unit, order)
      validate_contruction_order!(order)
      if order == "build_city"
        player_has_sufficient_growth?(unit.player) && suitable_city_build_location?(unit)
      else
        !unit.square.complete_structure?(order_structure(order))
      end
    end

    # For a given player returns whether or not they have enough growth to build/grow a city
    def player_has_sufficient_growth?(player)
      player.growth > 0
    end

    # For a given unit returns whether or not a city can be built/grown there
    def suitable_city_build_location?(unit)
      on_city = unit.square.structure("city") && unit.square.structure("city").player == unit.player
      neighbours = unit.square.neighbours(rules_hash["min_city_distance"] - 1)
      enough_space = neighbours.none? { |square| square.structure("city") }

      on_city || enough_space
    end

    # Raises rule error if order is not a contruction order
    def validate_contruction_order!(order)
      return true if order_type(order) == "construction"
      raise RuleError, "#{order} is not a construction order"
    end

    # Raises rule error if order is not a state transform order
    def validate_state_transform_order!(order)
      return true if order_type(order) == "transform_to"
      raise RuleError, "#{order} is not a state transform order"
    end
  end

  extend ClassMethods
end
