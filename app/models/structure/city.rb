module Structure
  class City < Base
    field :production, type: String, default: "nothing"
    size :production, type: Integer, default: 1
  end
end