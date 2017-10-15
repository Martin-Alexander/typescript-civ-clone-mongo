class PagesController < ApplicationController
  def home
    @games = Game.all
  end

  def lobby
  end
end