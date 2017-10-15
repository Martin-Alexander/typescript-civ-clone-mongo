Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home", as: "home"
  get "/lobby/:id", to: "pages#lobby", as: "lobby"
  post "/lobby/leave", to: "lobbies#leave", as: "leave_lobby"
  post "/lobby/:id/join", to: "lobbies#join", as: "join_lobby"
end
