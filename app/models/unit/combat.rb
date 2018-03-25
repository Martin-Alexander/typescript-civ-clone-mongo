module Unit
  class Combat < Base
    field :strength, type: Integer, default: 1

    def combat?
      true
    end    
  end
end