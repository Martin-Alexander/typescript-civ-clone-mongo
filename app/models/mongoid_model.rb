class MongoidModel
  include Mongoid::Document

  # Provides a method for declaring an objects children
  def self.direct_children(*args)
    class_eval %Q(
      def get_direct_children
        #{args}
      end
    )
  end

  # Returns hash representation of obects fields (but not its embedded children) 
  def hashify_fields
    output_hash = {}
    fields.each_key do |field_name|
      if field_name == "_id"
        output_hash[:id] = id.to_s
      elsif field_name == "_type"
        output_hash[:type] = _type.split("::").last.downcase
      else
        output_hash[field_name.to_sym] = send(field_name.to_sym)
      end
    end
    output_hash
  end

  # Returns hash representation of object and all children recursively
  def to_hash
    output = hashify_fields
    if respond_to?(:get_direct_children)
      get_direct_children.each do |child|
        output[child] = send(child).map(&:to_hash)
      end
    end
    output
  end

  # Returns json string of object hash
  def to_json
    JSON.generate(to_hash)
  end
end
