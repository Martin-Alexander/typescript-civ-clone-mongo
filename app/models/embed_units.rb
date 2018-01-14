module EmbedUnits
  # Takes in a list of unit names as symbols
  def embed_units(*args)
    args.each do |unit|

      # Embeds each unit (assuming a specific naming convention)
      embeds_many unit, class_name: "Unit::#{unit.to_s.singularize.capitalize}"

      # Creates a 'create_#{unit_name}' method to create that unit
      Square::Global.class_eval %Q(
        def create_#{unit.to_s.singularize}(*args)
          #{unit}.create! args
        end
      )      
    end

    # Returns as symbols all valid unit types
    Square::Global.class_eval %Q(
      def self.unit_types
        #{args.to_s}
      end
    )
  end
end