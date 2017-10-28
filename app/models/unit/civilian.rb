module Unit
  class Civilian < Base
    embedded_in :square, class_name: "Square::Global"
  end
end