class Structure < MongoidModel
  include Mongoid::Attributes::Dynamic

  embedded_in :square, class_name: "Square::Global"

  field :type, type: String
  field :player_number, type: Integer, default: 0
  field :construction_level, type: Integer, default: 0
  field :complete, type: Boolean, default: false

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
end