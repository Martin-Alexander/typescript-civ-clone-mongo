class AStar

	# Initialize A Star object and returns results of run
	def self.run(game_object, square_objects)
		AStar.new(game_object, square_objects).run
	end

	# Initialize an A Star object that is read to be run (shouldn't be called directly)
	def initialize(game_object, square_objects)
		@board = AbstractBoard.new(game_object)
		@start = AbstractSquare.new(square_objects[:start])
		@finish = AbstractSquare.new(square_objects[:finish])
	end

	# Handle actual implementation of A Star
	def run
		puts "========== A STAR RUN ==================="
	end
end