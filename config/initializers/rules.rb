class Rules 
  module ClassMethods
    def raw
      YAML.load(File.open(File.join(Rails.root, "config/rules.yml")))
    end

    # Given a unit, the square it one, and the player who owns it: What are it's available orders
    def orders_for_unit(unit)
      case unit.type
      when "worker"
        orders_for_worker(unit)
      else
        raw["units"][unit.type]["allowed_orders"]
      end
    end

    # Returns the type of a given order
    def order_type(order)
    end

    # Returns the structure of a given construction order
    def construction_order_structure(order)
    end

    private

    def orders_for_worker(unit)
      allowed_orders = []
      raw["units"][unit.type]["allowed_orders"].each do |order|
        if raw["orders"][order]["type"] == "construction" 
        end
      end
    end

    def validate_unit_square_and_player(unit)
    end
  end

  extend ClassMethods
end
