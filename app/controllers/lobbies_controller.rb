class LobbiesController < ApplicationController
  def leave
    current_user.leave_lobby
    redirect_to home_path
  end
end