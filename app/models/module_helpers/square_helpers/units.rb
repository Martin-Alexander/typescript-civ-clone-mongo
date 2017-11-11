module Units
	def units
		Square::Global.unit_types.each_with_object([]) do |type, array|
			array << send(type)
		end.flatten
	end

	def create_unit(unit, *args)
		send(unit.to_s.pluralize.to_sym).create! args
	end	
end