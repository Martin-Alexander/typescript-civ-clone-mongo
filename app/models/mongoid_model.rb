class MongoidModel
	include Mongoid::Document

	def self.direct_children(*args)
		class_eval %Q(
			def get_direct_children
				#{args}
			end			
		)
	end

	def hashify_fields
		output_hash = {}
		fields.keys.each do |field_name| 
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

	def children_types
		_children.map { |em| em.class }.uniq
	end

	def to_hash
		output = hashify_fields
		if respond_to?(:get_direct_children)
			get_direct_children.each do |child|
				output[child] = send(child).map { |childs_child| childs_child.to_hash }
			end
		end
		return output
	end
end