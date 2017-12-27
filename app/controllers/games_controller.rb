class GamesController < ApplicationController
  def create
    new_game = current_user.create_game
    redirect_to game_path(new_game)
  end

  def start
    game = Game.find(params[:id])
    game.generate_game_data
    game.start if game.ready_to_start? && game.host == current_user
    redirect_to game_path(game)
  end

  def leave
    game = Game.find(params[:id])
    game.player(current_user).role == "player" ? current_user.resign(game) : redirect_to(home_path)
  end

  def input
    # byebug
    @game = Game.find(params[:game])
    send(params[:method].to_sym)
  end

  private

  def piece_move   
    @path = params[:data][:path]
    @unit = @game.find_square(@path[0]).units.find(params[:data][:unit]).first

    move_result = @unit.move(@path)

    if move_result[:success]
      broadcast({
        type: "piece_move",
        path: move_result[:path],
        new_squares: move_result[:new_squares]
      })
    end

    respond_to do |format|      
      format.json { render json: { status: "OK" } }
    end    
  end

  def broadcast(data)
    ActionCable.server.broadcast("game_channel_#{@game.id}", data)
  end
end