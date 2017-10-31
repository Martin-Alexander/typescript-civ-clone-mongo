module Unit
  class Combat < Base
    embedded_in :square, class_name: "Square::Global"
    
    def move(new_parent)
      unless new_parent.id == _parent.id
        new_parent.combat_units << self.dup
        self.delete
      end
    end    
  end
end