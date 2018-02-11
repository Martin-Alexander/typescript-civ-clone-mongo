module EmbedStructures
  def self.included(base)
    base.extend(ClassMethods)
    base.include(InstanceMethods)
  end

  module ClassMethods
    # Takes in a list of structures names as symbols
    def embed_structures(*args)
      args.each do |structure|

        # Embeds each unit (assuming a specific naming convention)
        embeds_many structure, class_name: "Structure::#{structure.to_s.singularize.capitalize}"

        # Creates a 'create_#{unit_name}' method to create that unit
        Square::Global.class_eval %Q(
          def create_#{structure.to_s.singularize}(*args)
            #{structure}.create! args
          end
        )      
      end

      # Returns as symbols all valid structure types
      Square::Global.class_eval %Q(
        def self.structure_types
          #{args.to_s}
        end
      )
    end
  end

  module InstanceMethods
    # Returns an array of all units embedded in the square
    def structures
      Square::Global.structure_types.each_with_object([]) do |type, array|
        array << send(type)
      end.flatten
    end

    # Given a unit type and list of properties, creates an embedded unit
    def create_structure(structure, *args)
      send(structure.to_s.pluralize.to_sym).create! args
    end

    def get_structure(type)
      structures.find { |structure| structure.type == type }
    end

    def complete_structure?(type)
      structures.any? do |structure| 
        structure.type == type && structure.complete
      end
    end

    def structure_status(type)
      if get_structure(type) && get_structure(type).complete
        "present"
      elsif get_structure(type) && !get_structure(type).complete
        "under_contruction"
      else
        "absent"
      end
    end    
  end  
end