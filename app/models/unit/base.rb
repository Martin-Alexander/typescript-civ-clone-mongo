module Unit
  class Base
    include Mongoid::Document

    field :player_number, default: 0
  end
end