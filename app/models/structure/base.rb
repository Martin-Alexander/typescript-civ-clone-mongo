module Structure
  class Base < MongoidModel
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
      Rules["structures"][type]
    end

    # Implements logic related to a worker spending a turn building a structure
    def build
      if complete
        raise ArgumentError, "structure is already complete"
      else
        update(construction_level: construction_level + 1)
        if construction_level >= structure_rules["time_cost"]
          update(complete: true)
        end
      end
    end

    def apply_turn_rollover_logic; end
  end
end
