puts "Seeding..."

User.destroy_all
Player.destroy_all
Game.destroy_all

puts " - All users, players, and games destroyed"

martin = User.create! username: "martin", password: "123456"
sophie = User.create! username: "sophie", password: "123456"
chloe = User.create! username: "chloe", password: "123456"

puts " - Users created"

new_game = Game.create! state: "lobby"
chloe_game = Game.create! state: "lobby"

Player.create! user: martin, game: new_game, host: true
Player.create! user: sophie, game: new_game
Player.create! user: chloe, game: chloe_game, host: true

puts " - Game and players created"

puts "Done"