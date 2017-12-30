module Square
  class Global < Base
    extend EmbedUnits
    include Units

    direct_children :units, :structures

    embedded_in :board, class_name: "Game"
    embed_units :infantry, :tanks, :ships, :workers
    embeds_many :structures
  end
end