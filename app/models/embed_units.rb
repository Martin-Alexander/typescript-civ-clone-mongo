module EmbedUnits
  def self.included(base)
    base.extend(ClassMethods)
    base.include(InstanceMethods)
  end

  module ClassMethods
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

  module InstanceMethods
    # Returns an array of all units embedded in the square
    def units
      Square::Global.unit_types.each_with_object([]) do |type, array|
        array << send(type)
      end.flatten
    end

    # Given a unit type and list of properties, creates an embedded unit
    def create_unit(unit, *args)
      send(unit.to_s.pluralize.to_sym).create! args
    end
  end
end
