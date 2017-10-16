class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  before_action :keep_user_in_lobby
  before_action :keep_user_in_game

  def keep_user_in_lobby
    if current_user && current_user.lobby && (params[:id] != current_user.lobby.id.to_s || params[:action] != "lobby")
      redirect_to lobby_path(current_user.lobby)
    end
  end

  def keep_user_in_game
    if current_user && current_user.ongoing_game_playing_in (params[:id] != current_user.ongoing_game_playing_in.id.to_s || params[:action] != "show")
      # TODO
    end
  end
end
