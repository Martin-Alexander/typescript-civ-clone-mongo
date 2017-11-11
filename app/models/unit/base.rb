module Unit
  class Base < MongoidModel
    embedded_in :square, class_name: "Square::Global"

    field :player_number, default: 0
    
    # Basic move implemenation
    # TEST MODE
    def move(square)
      unless square.id == _parent.id
        square.infantry << self.dup
        self.delete
      end
    end

    # Basic move validation
    # TEST MODE
    def move_valid?(to_square)
      from_square = _parent
      true
    end
  end
end