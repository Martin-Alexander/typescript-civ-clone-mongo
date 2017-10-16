class PagesController < ApplicationController
  before_action :keep_user_in_lobby

  def home
    @games = Game.all_lobbies
  end

  def lobby
    @lobby = Game.find(params[:id])
    @players = @lobby.players.sort_by { |player| player.host ? 0 : 1 }
    @current_player = Player.where(game: @lobby, user: current_user).first
  end

  private

  def keep_user_in_lobby
    if current_user.lobby && (params[:action] == "home" || params[:id] != current_user.lobby.id.to_s)
      redirect_to lobby_path(current_user.lobby)
    end
  end
end