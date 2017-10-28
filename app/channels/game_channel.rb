class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "game_channel_#{params[:room]}"
  end
end