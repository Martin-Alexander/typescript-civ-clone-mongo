class PagesController < ApplicationController
  def home
    @games = Game.all_lobbies
  end

  def lobby
    @lobby = Game.find(params[:id])
    @players = @lobby.players.sort_by { |player| player.host ? 0 : 1 }
    @current_player = Player.where(game: @lobby, user: current_user).first
  end
end