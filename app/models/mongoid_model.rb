class MongoidModel
	def to_hash
		JSON.parse(to_json)
	end
end