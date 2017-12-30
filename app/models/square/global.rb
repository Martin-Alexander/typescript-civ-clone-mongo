module Square
  class Global < Base
    extend EmbedUnits
    include Units

    direct_children :units, :structures

    embedded_in :board, class_name: "Game"
    embed_units :infantry, :tanks, :ships, :workers
    embeds_many :structures

    def get_structure(type)
      structures.where(type: type).first
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
  end
end