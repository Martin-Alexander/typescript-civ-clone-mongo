class GamesController < ApplicationController
  def leave
    current_user.resign(Game.find(params[:id]))
  end
end