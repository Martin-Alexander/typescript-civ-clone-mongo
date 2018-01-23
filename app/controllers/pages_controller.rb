class PagesController < ApplicationController
  before_action :keep_user_on_page

  def home
    @games = Game.all_lobbies
  end

  def lobby
    redirect_to home_path unless current_user.lobby
    @lobby = Game.find(params[:id])
    @players = @lobby.players.sort_by { |player| player.host ? 0 : 1 }
    @current_player = Player.where(game: @lobby, user: current_user).first
  end

  def game
    @game = Game.find(params[:id])

    # Generating new terrain on each page load for testing purpose
    @game.generate_terrain
    
    redirect_to home_path unless current_user.in_game?(@game)
    @players = @game.players
    @current_player = current_user.player_of_game(@game)
  end
end