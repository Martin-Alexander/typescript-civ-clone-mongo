module Square
  class Global < Base
    embedded_in :board, class_name: "Game"
    embeds_many :combat_units, class_name: "Unit::Combat"
    embeds_many :workers, class_name: "Unit::Worker"
    
    # Returns a collection of all units in square
    def units
      combat_units + workers
    end
  end
end