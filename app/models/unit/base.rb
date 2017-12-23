module Unit
  class Base < MongoidModel
    embedded_in :square, class_name: "Square::Global"

    field :player_number, default: 0
    
    # Default move function
    def move(to_square)
      if move_valid?(to_square)
        to_square.infantry << self.dup
        self.delete
        return true
      else
        return false
      end
    end

    # Default move validation
    def move_valid?(to_square)
      square.neighbours.include?(to_square)
    end

    def type
      _type
    end
  end
end