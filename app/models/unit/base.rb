module Unit
  class Base
    include Mongoid::Document

    embedded_in :square, class_name: "Square::Global"
    
    field :player_number, default: 0

    def move(new_parent)
      unless new_parent.id == _parent.id
        new_parent.combat_units << self.dup
        self.delete
      end
    end     
  end
end