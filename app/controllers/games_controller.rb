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
    game = Game.find(params[:game_id])
    send(params[:method].to_sym, game)
  end

  private

  def piece_move(game)
    data = params.require(:data).permit(:to, :from).to_h
    
    from_square = game.squares.find(data[:from])
    to_square = game.squares.find(data[:to])
    
    # This still is not connected to anything but it does work
    AStar.run(game, start: from_square, finish: to_square)
    
    ActionCable.server.broadcast "game_channel_#{game.id}", {
      type: "piece_move",
      new_squares: game.move(from_square, to_square)
    }
  end
end