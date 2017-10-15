class LobbiesController < ApplicationController
  def leave
    current_user.leave_lobby
    redirect_to home_path
  end

  def join
    game = Game.find(params[:id])
    current_user.join_game(game) if current_user.can_join_game?(game)
    redirect_to lobby_path(game)
  end
end