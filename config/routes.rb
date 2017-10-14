Rails.application.routes.draw do
  devise_for :users
  root to: "pages#home", as: "home"
  get "/lobby/:id", to: "pages#lobby", as: "lobby"
end
