module Square
  class Global < Base
    extend EmbedUnits
    include Units

    direct_children :units

    embedded_in :board, class_name: "Game"
    embed_units :infantry, :tanks, :ships, :workers
  end
end