class AbstractBoard
	attr_reader :squares
	def initialize(game_object)
		@squares = []
		game_object.squares.each do |square|
			@squares << AbstractSquare.new(square)
		end
	end
end