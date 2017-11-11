module Unit
  class Base < MongoidModel
    embedded_in :square, class_name: "Square::Global"

    field :player_number, default: 0
    
    # Basic move implemenation
    # TEST MODE
    def move(to_square)
      if move_valid?(to_square)
        to_square.infantry << self.dup
        self.delete
      end
    end

    # Basic move validation
    # TEST MODE
    def move_valid?(to_square)
      square.neighbours.include?(to_square)
    end
  end
end