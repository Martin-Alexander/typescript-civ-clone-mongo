# NOT IN USE

module Movement
  # Represents a users movement command
  class Input
    # Accepts the two pieces of information given by the user: the unit, and the path
    def initialize(unit, path)
    end

    # Returns whether or not the immediate move can be executed
    def valid?
    end

    # Updated database
    def execute
    end

    # Returns information need by front end to animate move
    def front_end_move_result
    end
  end
end