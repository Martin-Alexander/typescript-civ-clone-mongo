class GamesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :input ]
  skip_before_action :verify_authenticity_token, only: [ :input ]

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
    current_user = User.find(params[:user_id])
    game = Game.find(params[:game_id])
    from_square = game.squares.find(params[:data][:from])
    to_square = game.squares.find(params[:data][:to])

    AStar.run(game, start: from_square, finish: to_square)

    # This will eventually be the single endpoint for the game logic API
    # but for now it will just implement a move for testing purposes
    ActionCable.server.broadcast "game_channel_#{game.id}", {
      result: game.move(from_square, to_square)
    }
  end
end