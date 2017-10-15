class PagesController < ApplicationController
  before_action :keep_user_in_lobby

  def home
    @games = Game.all
  end

  def lobby
  end

  private

  def keep_user_in_lobby
    if current_user.lobby && (params[:action] == "home" || params[:id] != current_user.lobby.id.to_s)
      redirect_to lobby_path(current_user.lobby)
    end
  end
end