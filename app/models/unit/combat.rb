module Unit
  class Combat < Base
    embedded_in :square, class_name: "Square::Global"
  end
end