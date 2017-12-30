class Game < MongoidModel
  include BoardHelpers
  include BoardSetup
  include GameLogic
  include Lobby
  extend ClassLobby

  direct_children :game_players, :squares

  has_many :players
  embeds_many :game_players
  embeds_many :squares, class_name: "Square::Global"

  field :state, type: String
  field :size, type: Integer, default: 0

  validates :state, inclusion: { in: ["lobby", "ongoing", "over", "paused"] }

  # Returns a hash of game data that is prepared for the client
  def client_game_data(current_user)
    game_data = to_hash

    game_data[:game_players].map! do |game_player|
      if game_player[:user_id] == current_user.id.to_s
        game_player[:current_player] = true
        game_player
      else
        { 
          user_id: game_player[:user_id], 
          number: game_player[:number],
          current_player: false
        }
      end
    end

    game_data
  end
end