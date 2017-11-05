module Square
  class Global < Base
    extend EmbedUnits

    embedded_in :board, class_name: "Game"
    embed_units :infantry, :tanks, :ships, :workers
  end
end