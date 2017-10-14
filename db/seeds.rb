puts "Seeding..."

User.destroy_all
Player.destroy_all
Game.destroy_all

puts " - All users, players, and games destroyed"

User.create! username: "martin", password: "123456"
User.create! username: "sophie", password: "123456"
User.create! username: "chloe", password: "123456"

puts " - Users created"

puts "Done"