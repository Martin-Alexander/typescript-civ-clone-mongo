module Square
  class Global < Base
    include EmbedUnits
    include EmbedStructures

    direct_children :units, :structures

    embedded_in :board, class_name: "Game"
    embed_units :infantry, :tanks, :ships, :workers
    embed_structures :roads, :fortresses, :farms, :cities

    field :terrain, type: String, default: "grass"
  end
end
