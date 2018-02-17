class Board
  attr_reader :squares, :size

  def initialize(size)
    @size = size
    @squares = []

    (0..size).each do |y_coord|
      (0..size).each do |x_coord|
        @squares << Square.new(x_coord, y_coord, self)
      end
    end

    # Create some mountain roots
    ((size / 16)..(size / 8)).to_a.sample.times { squares_within(size / 4).sample.terrain = "mountains" }

    # Extend mountain roots and build mountain ranges
    size.times do
      squares.each do |square|
        if square.neighbouring_terrain("mountains") == 1 &&
        square.neighbouring_terrain("mountains", 2) < 3 &&
        square.neighbouring_terrain("mountains", 4) < 5 &&
        rand(12).zero?
          square.terrain = "mountains"
        end
      end
    end

    # Flesh out mountain ranges
    fill_in_squares = []
    2.times do 
      squares.each do |square|
        if square.terrain != "mountains"
          case square.neighbouring_terrain("mountains")
          when 0
          when 1
            fill_in_squares << square if rand(4).zero?
          when 2
            fill_in_squares << square if rand(3).zero?
          when 3
            fill_in_squares << square if rand(2).zero?
          else
            fill_in_squares << square
          end
        end
      end
    end
    fill_in_squares.each { |square| square.terrain = "mountains" }

    # Create some water roots
    ((size / 8)..(size / 4)).to_a.sample.times { squares.sample.terrain = "water" }

    # Increase water
    6.times do
      squares.each do |square|
        if square.terrain == "grass"
          case square.neighbouring_terrain("water")
          when 0
          when 1
            square.terrain = "water" if rand(5).zero?
          when 2
            square.terrain = "water" if rand(4).zero?
          when 3
            square.terrain = "water" if rand(3).zero?
          else
            square.terrain = "water" 
          end
        end          
      end
    end

    # Remove isolated water patches
    squares.each do |square|
      if square.terrain == "water" && square.neighbouring_terrain("water") < 3
        square.terrain = "grass"
      end
    end

    # Create some plains roots
    ((size / 2)..(size)).to_a.sample.times do
      square = squares.sample
      if (square.neighbouring_terrain("water", 3).zero? || rand(2).zero?) &&
      (square.neighbouring_terrain("water", 2).zero? || rand(4).zero?) &&
      (square.neighbouring_terrain("water").zero? || rand(8).zero?)
        square.terrain = "plains" 
      end
    end

    # Increase plains
    6.times do
      squares.each do |square|
        if square.terrain == "grass" && 
        (square.neighbouring_terrain("water", 3).zero? || rand(2).zero?) &&
        (square.neighbouring_terrain("water", 2).zero? || rand(4).zero?) &&
        (square.neighbouring_terrain("water").zero? || rand(8).zero?)
          case square.neighbouring_terrain("plains")
          when 0
          when 1
            square.terrain = "plains" if rand(6).zero?
          when 2
            square.terrain = "plains" if rand(5).zero?
          when 3
            square.terrain = "plains" if rand(4).zero?
          else
            square.terrain = "plains" 
          end
        end          
      end
    end
    
    # Create some desert roots
    ((size / 4)..(size)).to_a.sample.times do
      square = squares.sample
      if square.terrain == "plains" &&
      (square.neighbouring_terrain("grass", 2).zero? || rand(4).zero?) &&
      (square.neighbouring_terrain("grass").zero? || rand(8).zero?)
        square.terrain = "desert" 
      end
    end

    8.times do
      squares.each do |square|
        if square.terrain == "plains" && square.neighbouring_terrain("grass", 2).zero?
          case square.neighbouring_terrain("desert")
          when 0
          when 1
            square.terrain = "desert" if rand(4).zero?
          when 2
            square.terrain = "desert" if rand(3).zero?
          when 3
            square.terrain = "desert" if rand(2).zero?
          else
            square.terrain = "desert" 
          end
        end          
      end
    end
  end

  def player_starting_locations(number_of_players)
    squares.map { |square| [square, square.desirability(size / 5)] }.sort { |a, b| b[1] <=> a[1] }
    
    sorted_squares = {}
    squares.each do |square|
      if !["water", "desert", "mountains"].include?(square.terrain) && 
      square.neighbouring_terrain("mountains", 1).zero? &&
      square.neighbouring_terrain("desert", 2).zero? &&
      square.neighbours(3).length > 40
        if sorted_squares[square.desirability(10)]
          sorted_squares[square.desirability(10)] << square
        else 
          sorted_squares[square.desirability(10)] = [square]
        end
      end
    end

    enough_squares = {}
    sorted_squares.each do |desirability_of_squares, all_squares|
      if all_squares.length >= number_of_players
        enough_squares[desirability_of_squares] = all_squares[0...number_of_players]
      end
    end

    starting_locations = []
    enough_squares.each do |desirability_of_squares, all_squares|
      minimum_distance = all_squares.combination(2).map { |pair| distance(pair[0], pair[1]) }.min
      starting_locations << {
        squares: all_squares,
        minimum_distance: minimum_distance
      }
    end
    
    starting_locations.sort { |a, b| b[:minimum_distance] <=> a[:minimum_distance] }.first[:squares]
  end

  def distance(a, b)
    (a.x - b.x).abs + (a.y - b.y).abs
  end

  def find_square(col, row = false)
    if col.respond_to?(:keys) 
      row = col[:y] || col["y"]
      col = col[:x] || col["x"]
    end
    if row && (row > size || col > size)
      raise ArgumentError, "Invalid row #{row} or col #{col} for board size of #{size}"
    end
    if row
      squares[row * (size + 1) + col]
    else
      squares[col.to_i]
    end
  end

  def squares_within(radius)
    squares.select do |square|
      (square.x - size / 2).abs <= radius && (square.y - size / 2).abs <= radius
    end
  end

  def to_s
    "<Board: size: #{@size}>"
  end

  def inspect
    "<Board: size: #{@size}>"
  end

  class Square
    attr_accessor :x, :y, :terrain, :board

    def initialize(x, y, board)
      @board = board
      @x = x
      @y = y
      @terrain = "grass"
    end

    def neighbours(radius = 1)
      (-radius..radius).each_with_object([]) do |x_diff, array|
        (-radius..radius).each do |y_diff|
          unless (x_diff.zero? && y_diff.zero?) ||
          x_diff + x < 0 || y_diff + y < 0 || 
          x_diff + x > board.size ||
          y_diff + y > board.size
            array << board.find_square(x_diff + x, y_diff + y)
          end
        end
      end
    end

    def neighbouring_terrain(terrain, radius = 1)
      neighbours(radius).select { |square| square.terrain == terrain }.length
    end

    def desirability(radius)
      running_total = 0
      neighbours(radius).each do |neighbour|
        running_total += desirability_lookup(neighbour.terrain)
      end

      (running_total / 1000) * 1000
    end

    def desirability_lookup(terrain)
      {
        grass: 175,
        plains: 150,
        desert: 10,
        water: 50,
        mountains: 10
      }[terrain.to_sym]
    end
    
    def to_s
      "<Square: x: #{@x}, y: #{@y}, terrain: #{@terrain}>"
    end

    def inspect
      "<Square: x: #{@x}, y: #{@y}, terrain: #{@terrain}>"
    end
  end
end