module UnitModules
  module Merging
    def merge_validations
      [
        :are_adjacent,
        :are_free_of_units_except_for_final_square,
        :last_square_is_mergable
      ]
    end

    def merge(path)
      ::Merging::Input.new(self, path, merge_validations).front_end_move_result
    end
  end
end