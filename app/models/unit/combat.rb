module Unit
  class Combat < Base
    include UnitModules::Merging
    field :strength, type: Integer, default: 1

    def combat?
      true
    end

    def supply_cost
      strength
    end
  end
end