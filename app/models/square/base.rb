module Square
  class Base
    include Mongoid::Document

    field :x, type: Integer
    field :y, type: Integer
  end
end