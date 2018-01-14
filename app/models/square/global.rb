module Square
  class Global < Base
    extend EmbedUnits

    direct_children :units, :structures

    embedded_in :board, class_name: "Game"
    embed_units :infantry, :tanks, :ships, :workers
    embeds_many :structures

    def get_structure(type)
      structures.where(type: type).first
    end

    def has_complete_structure(type)
      structures.where(type: type, complete: true).any?
    end

    def structure_status(type)
      if get_structure(type) && get_structure(type).complete
        "present"
      elsif get_structure(type) && !get_structure(type).complete
        "under_contruction"
      else
        "absent"
      end
    end

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