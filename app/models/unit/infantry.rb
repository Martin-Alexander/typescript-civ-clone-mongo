module Unit
  class Infantry < Combat
    # Warning: The assumption about infantry going foward is that a square will
    # never contain infantry units with different amounts of moves remaining

    # Moves all infantry units in the same square
    def move(to_square)
      if move_valid?(to_square)
        infantry_in_square = square.units.select { |unit| unit.type == self.class.to_s }
        infantry_in_square.each { |infantry| to_square.infantry << infantry.dup }
        infantry_in_square.each { |infantry| infantry.delete }
        return true
      else
        return false
      end
    end
  end
end