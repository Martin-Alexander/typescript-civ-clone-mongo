module EmbedUnits
  def embed_units(*args)
    args.each do |unit|
      embeds_many unit, class_name: "Unit::#{unit.to_s.singularize.capitalize}"
    end

    Square::Global.class_eval %Q(
      def self.unit_types
        #{args.to_s}
      end
    )

    Square::Global.class_eval %Q(
      def units
        Square::Global.unit_types.each_with_object([]) do |type, array|
          array << send(type)
        end.flatten
      end
    )
  end
end