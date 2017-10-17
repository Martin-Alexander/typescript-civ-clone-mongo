class LobbiesController < ApplicationController
  def leave
    current_user.leave_lobby
    redirect_to home_path
  end

  def join
    game = Game.find(params[:id])
    if current_user.can_join_game?(game)
      current_user.join_game(game) 
      redirect_to lobby_path(game)
    end
  end

  def start
    game = Game.find(params[:id])
    game.start if current_user && game.ready_to_start?
    redirect_to game_path(game)
  end
end