class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!

  def keep_user_on_page
    if current_user.lobby && "pages#lobby/#{current_user.lobby.id}" != route_with_id
      redirect_to lobby_path(current_user.lobby)
    elsif current_user.ongoing_game && "pages#game/#{current_user.ongoing_game.id}" != route_with_id
      redirect_to game_path(current_user.ongoing_game)
    end
  end

  def route_with_id
    if params[:id]
      "#{params[:controller]}##{params[:action]}/#{params[:id]}"
    else
      "#{params[:controller]}##{params[:action]}"
    end
  end

  def respond_with_success
    respond_to do |format|
      format.json { render json: { status: "OK" } }
    end
  end

  def respond_with_failure
    respond_to do |format|
      format.json { render json: { status: "OK" } }
    end    
  end

  def broadcast(data)
    ActionCable.server.broadcast("game_channel_#{@game.id}", data)
  end  
end
