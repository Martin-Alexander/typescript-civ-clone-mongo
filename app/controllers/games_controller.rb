class GamesController < ApplicationController
  def leave
    game = Game.find(params[:id])
    if game.player(current_user).role == "player"
      current_user.resign(game)
    else
      current_user.leave_game(game)
      redirect_to home_path
    end
  end
end