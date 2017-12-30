class GamesController < ApplicationController
  def create
    new_game = current_user.create_game
    redirect_to game_path(new_game) if new_game
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
    @game = Game.find(params[:game])
    send(params[:method].to_sym)  
  end

  private

  def piece_move   
    @path = params[:data][:path]
    @unit = @game.find_square(@path[0]).units.find(params[:data][:unit]).first

    move_result = @unit.move(current_user, @path)

    if move_result[:success]
      broadcast({
        type: "piece_move",
        path: move_result[:path],
        moved_unit: move_result[:moved_unit],
        new_squares: move_result[:new_squares]
      })
    end

    respond_with_success
  end

  def next_turn
    @game.next_turn

    broadcast({
      type: "next_turn"
    })

    respond_with_success
  end

  def give_order
    @square = @game.find_square(params[:data][:square_coords])
    @unit = @square.units.find(params[:data][:unit]).first

    if @unit.give_order(params[:data][:order])
      broadcast({
        type: "give_order",
        new_square: @square.to_hash
      })
    end

    respond_with_success
  end

  def get_game_data
    respond_to do |format|      
      format.json { render json: { 
        status: "OK",
        new_game: @game.client_game_data(current_user)
      } }
    end   
  end

  def respond_with_success
    respond_to do |format|      
      format.json { render json: { status: "OK" } }
    end    
  end

  def broadcast(data)
    ActionCable.server.broadcast("game_channel_#{@game.id}", data)
  end
end