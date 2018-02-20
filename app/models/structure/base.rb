module Structure
  class Base
    include Mongoid::Document
    include CivCloneMongoModel

    embedded_in :square, class_name: "Square::Global"

    field :player_number, type: Integer, default: 0
    field :construction_level, type: Integer, default: 0
    field :complete, type: Boolean, default: false

    # returns string representation of structure type
    def type
      _type.split("::").last.downcase
    end

    # Returns the rules for structure
    def structure_rules
      Rules.raw["structures"][type]
    end

    # Implements logic related to a worker spending a turn building a structure
    def build
      raise ArgumentError, "structure is already complete" if complete
      update(construction_level: construction_level + 1)
      update(complete: true) if construction_level >= structure_rules["time_cost"]
    end

    def apply_turn_rollover_logic(x); end

    def player
      square.game.player(player_number)
    end
  end
end
