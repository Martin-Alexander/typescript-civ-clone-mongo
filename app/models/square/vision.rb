module Square
  class Vision < Base
    embedded_in :board, class_name: "GamePlayer"
  end
end