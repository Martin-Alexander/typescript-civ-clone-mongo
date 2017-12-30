module Unit
  class Ship < Combat
    def execute_move(to_square)
      new_unit = self.dup
      to_square.ships << new_unit
      self.delete

      return new_unit      
    end    
  end
end