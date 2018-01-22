def generateUnits(game, quantity)
  print " - Generating units..."
  quantity.times do
    game.squares.sample.create_unit Square::Global.unit_types.sample, player_number: game.game_players.sample.number
  end
  done
end

def done
  puts " done"
end

require 'highline/import'

puts "Seeding..."

print " - Destroying all users, players, and games..."

User.destroy_all
Player.destroy_all
Game.destroy_all

done

print " - Creating users..."

martin = User.create! username: "martin", password: "123456"
sophie = User.create! username: "sophie", password: "123456"
chloe = User.create! username: "chloe", password: "123456"
brittany = User.create! username: "brittany", password: "123456"

done

print " - Creating players..."

new_game = Game.create! state: "lobby"

done

print " - Creating games..."

Player.create! user: martin, game: new_game, host: true
Player.create! user: sophie, game: new_game
# Player.create! user: chloe, game: new_game
# Player.create! user: brittany, game: new_game

done

if ENV["args"].chars.include?("g")
  print " - Starting game..."
  new_game.start
  done

  print " - Generating board..."
  new_game.generate_game_data
  done

  generateUnits(new_game, 50) if ENV["args"].chars.include?("u")
end

puts "Done"

