module GameModules
  module Logic
    include NextTurn
    # Returns whether or not all players are ready'd up
    def all_players_ready_for_next_turn
      true
      # players.all? { |player| player.turn_over }
    end

    # Returns a list of players who are ready'd up
    def who_is_ready_for_next_turn
      players.each_with_object([]) do |player, output|
        output << { number: player.number, turn_over: player.turn_over }
      end
    end

    # Takes either a square number or a column row number pair and returns the corresponding square
    def find_square(col, row = false)
      if col.respond_to?(:keys)
        row = col[:y] || col["y"]
        col = col[:x] || col["x"]
      end
      row ? squares[row * (size + 1) + col] : squares[col.to_i]
    end

    # Returns an array of all units on the board
    def units
      squares.each_with_object([]) do |square, array|
        square.units.each { |unit| array << unit }
      end
    end

    # Returns an array of all structures on the board
    def structures
      squares.each_with_object([]) do |square, array|
        square.structures.each { |structures| array << structures }
      end
    end    
  end
end
