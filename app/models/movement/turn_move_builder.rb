module Movement
  class TurnMoveBuilder
    def self.build(path, unit, game)
      path.each_cons(2).map do |coordinate_pair|
        from_square = game.find_square(coordinate_pair.first)
        to_square = game.find_square(coordinate_pair.last)
        AtomicMove.new(unit, from_square, to_square)
      end      
    end
  end
end