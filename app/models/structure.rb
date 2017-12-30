class Structure < MongoidModel
  include Mongoid::Attributes::Dynamic

  embedded_in :square, class_name: "Square::Global"

  field :type, type: String
  field :player_number, type: Integer, default: 0
end