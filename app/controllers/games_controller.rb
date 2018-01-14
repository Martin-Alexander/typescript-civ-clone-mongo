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
    current_user.resign(game) if game.player(current_user).role == "player"
    redirect_to(home_path)
  end

  def input
    @permitted_params = params.permit(:method, :game, data: {}).to_h

    @game = Game.find(@permitted_params[:game])

    current_user.alive_in_game?(@game) ? send(@permitted_params[:method].to_sym) : respond_with_failure
  end

  private

  def piece_move
    @path = @permitted_params[:data][:path]
    @unit = @game.find_square(@path[0]).units.find(@permitted_params[:data][:unit]).first

    if @game.game_players.where(number: @unit.player_number).first.user_id == current_user.id.to_s
      move_result = @unit.move(@path)

      if move_result[:success]
        broadcast({
          type: "piece_move",
          path: move_result[:path],
          moved_unit: move_result[:moved_unit],
          new_squares: move_result[:new_squares]
        })
      end
    end

    respond_with_success
  end

  def next_turn
    game_player = @game.game_players.where(user_id: current_user.id.to_s).first
    game_player.toggle_turn_over

    if @game.all_players_ready_for_next_turn
      move_animations = @game.next_turn

      broadcast({
        type: "next_turn",
        move_animations: move_animations.reject do |result|
          result.nil? || result[:success] == false
        end
      })
    end
    
    broadcast({
      type: "player_ready",
      players_ready: @game.who_is_ready_for_next_turn
    })

    respond_with_success
  end

  def give_order
    @square = @game.find_square(@permitted_params[:data][:square_coords])
    @unit = @square.units.find(@permitted_params[:data][:unit]).first

    if @unit.give_order(@permitted_params[:data][:order])
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

  def respond_with_failure
    respond_to do |format|
      format.json { render json: { status: "OK" } }
    end    
  end

  def broadcast(data)
    ActionCable.server.broadcast("game_channel_#{@game.id}", data)
  end
end