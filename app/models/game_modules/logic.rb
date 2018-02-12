module GameModules
  module Logic
    # Handles all game logic related to turn roll-over
    def next_turn
      squares.each do |square|
        square.structures.each do |structure|
          structure.apply_turn_rollover_logic
        end
      end

      players.update_all(turn_over: false)

      move_results = units.map do |unit|
        unit.apply_turn_rollover_logic
      end

      move_results
    end

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
  end
end
