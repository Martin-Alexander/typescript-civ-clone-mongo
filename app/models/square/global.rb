module Square
  class Global < Base
    embedded_in :board, class_name: "Game"
    embeds_many :infantry, class_name: "Unit::Infantry"
    embeds_many :tanks, class_name: "Unit::Tank"
    embeds_many :ships, class_name: "Unit::Ship"
    embeds_many :workers, class_name: "Unit::Worker"
    
    # Returns a collection of all units in square
    def units
      workers + infantry + tanks + ships
    end
  end
end