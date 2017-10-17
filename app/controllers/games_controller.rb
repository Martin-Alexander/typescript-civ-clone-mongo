class GamesController < ApplicationController
  def create
    redirect_to game_path(current_user.create_game)
  end

  def start
    game = Game.find(params[:id])
    game.start if current_user && game.ready_to_start?
    redirect_to game_path(game)
  end

  def leave
    game = Game.find(params[:id])
    game.player(current_user).role == "player" ? current_user.resign(game) : redirect_to(home_path)
  end
end