Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home", as: "home"
  get "/lobby/:id", to: "pages#lobby", as: "lobby"
  post "/lobby/leave", to: "lobbies#leave", as: "leave_lobby"
  post "/lobby/:id/join", to: "lobbies#join", as: "join_lobby"
  post "/player/:id/swap_role", to: "players#swap_role", as: "swap_role"
  post "/lobby/:id/start", to: "lobbies#start", as: "start"
  get "/game/:id", to: "pages#game", as: "game"
  post "/game/:id/leave", to: "games#leave", as: "leave_game"
end
