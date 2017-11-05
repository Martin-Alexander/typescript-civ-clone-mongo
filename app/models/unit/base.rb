module Unit
  class Base
    include Mongoid::Document

    embedded_in :square, class_name: "Square::Global"

    field :player_number, default: 0

    after_create :add_to_units

    def move(square)
      unless square.id == _parent.id
        square.infantry << self.dup
        self.delete
      end
    end

    def move_valid?(to_square)
      from_square = _parent
      true
    end

    def add_to_units
      square.units << self
      square.save
    end
  end
end