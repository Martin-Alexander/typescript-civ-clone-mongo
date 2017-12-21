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
    @game = Game.find(params[:game_id])
    send(params[:method].to_sym)
  end

  private

  def piece_move
    # byebug

    set_from_and_two_square
    
    broadcast({
      type: "piece_move",
      new_squares: @game.move(@from_square, @to_square)
    })

    respond_to do |format|      
      format.json { render json: { status: "OK" } }
    end    
  end

  def a_star
    set_from_and_two_square
    
    respond_to do |format|      
      format.json { 
        render json: {
          type: "a_star",
          path: AStar.run(@game, start: @from_square, finish: @to_square)
        }
      }
    end
  end

  def set_from_and_two_square
    data = params.require(:data).permit(:to, :from).to_h

    @from_square = @game.squares.find(data[:from])
    @to_square = @game.squares.find(data[:to])
  end

  def broadcast(data)
    ActionCable.server.broadcast("game_channel_#{@game.id}", data)
  end
end