module Square
  class Global < Base
    embedded_in :board, class_name: "Game"
    embeds_many :combat_units, class_name: "Unit::Combat"
    embeds_many :civilian_units, class_name: "Unit::Civilian"
  end
end