class PlayersController < ApplicationController
  def swap_role
    Player.find(params[:id]).swap_role
  end
end