module Units
  # Returns an array of all units embedded in the square
  def units
    Square::Global.unit_types.each_with_object([]) do |type, array|
      array << send(type)
    end.flatten
  end

  # Given a unit type and list of properties, creates an embedded unit
  def create_unit(unit, *args)
    send(unit.to_s.pluralize.to_sym).create! args
  end
end