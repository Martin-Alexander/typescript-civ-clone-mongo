module Unit
  class Tank < Combat
    def execute_move(to_square)
      new_unit = self.dup
      to_square.tanks << new_unit
      self.delete

      return new_unit      
    end    
  end
end