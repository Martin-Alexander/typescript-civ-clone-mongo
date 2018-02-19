class Rules
  def self.raw
    YAML.load(File.open(File.join(Rails.root, "config/rules.yml")))
  end

  # Given a unit, the square it one, and the player who owns it: What are it's available orders
  def self.orders_for_unit(unit)
    case unit.type
    when "worker"
      orders_for_worker(unit)
    else
      raw["units"][unit.type]["allowed_orders"]
    end
  end

  # Returns the type of a given order
  def self.order_type(order)
  end

  # Returns the structure of a given construction order
  def self.construction_order_structure(order)
  end

  private

  def self.orders_for_worker(unit)
  end

  def self.validate_unit_square_and_player(unit)
  end
end
