class AbstractSquare
	attr_reader :x, :y, :move_cost
	attr_accessor :path_via, :current_path_cost

	def initialize(square_object)
		@x = square_object.x
		@y = square_object.y
		@move_cost = calculate_move_cost(square_object)
		@path_via = nil
		@current_path_cost = infinity
	end

private
	
	def infinity
		1 << 32
	end

	# Eventually this will be used to factor in things like terrain type,
	# unit type, and the presense of roads
	def calculate_move_cost(square_object)
		square_object.units.any? ? infinity : 1
	end
end