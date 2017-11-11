module EmbedUnits
  def embed_units(*args)
    args.each do |unit|
      embeds_many unit, class_name: "Unit::#{unit.to_s.singularize.capitalize}"

      Square::Global.class_eval %Q(
        def create_#{unit.to_s.singularize}(*args)
          #{unit}.create! args
        end
      )      
    end

    Square::Global.class_eval %Q(
      def self.unit_types
        #{args.to_s}
      end
    )
  end
end