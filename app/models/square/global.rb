module Square
  class Global < Base
    extend EmbedUnits

    embedded_in :board, class_name: "Game"
    embed_units :infantry, :tanks, :ships, :workers

    def create_unit(unit, *args)
      send(unit.to_s.pluralize.to_sym).create! args
    end
  end
end