class SeedError < StandardError
  class InvalidOptionError < StandardError; end
end

def generate_units(game, quantity)
  quantity.times do
    game.squares.sample.create_unit Square::Global.unit_types.sample, player_number: game.players.sample.number
  end
end

def seed_task(message)
  print "- #{message}..."
  yield
  puts " done"
end

allowed_options = ["clean", "spam", "default"]
$option = ENV["options"] || "default"
if !(allowed_options.include?($option) || $option.nil?)
  raise SeedError::InvalidOptionError, "Invalid option: #{$option}"
end

puts "Seeding with `#{$option}` option..."

seed_task "Clearing database" do
  User.destroy_all
  Player.destroy_all
  Game.destroy_all
end

if $option == "clean"
  "Clean seed"
else
  seed_task "Creating users" do
    $martin = User.create! username: "martin", password: "123456"
    $player_two = User.create! username: "player_two", password: "123456"
    $player_three = User.create! username: "player_three", password: "123456"
    $player_four = User.create! username: "player_four", password: "123456"
    $player_five = User.create! username: "player_five", password: "123456"
    $player_six = User.create! username: "player_six", password: "123456"
  end

  seed_task "Creating games" do
    $new_game = Game.create! state: "lobby"
  end

  if ENV["players"].nil?
    $number_of_players = 2
  else
    $number_of_players = ENV["players"].to_i
  end

  seed_task "Creating #{$number_of_players} player(s)" do
    players = []

    players << Player.new(user: $martin, username: $martin.username)
    players << Player.new(user: $player_two, username: $player_two.username)
    players << Player.new(user: $player_three, username: $player_three.username)
    players << Player.new(user: $player_four, username: $player_four.username)
    players << Player.new(user: $player_five, username: $player_five.username)
    players << Player.new(user: $player_six, username: $player_six.username)

    if $number_of_players > players.length || $number_of_players < 1
      raise SeedError::InvalidOptionError, "Invalid number of players: #{$number_of_players}"
    end

    players.first.host = true

    players[0...$number_of_players].each do |player|
      player.game = $new_game
      player.save!
    end
  end
  seed_task("Starting game") { $new_game.start }
  seed_task("Generating board") { $new_game.generate_game_data }
  if $option == "spam"
    seed_task("Spamming board with units") { generate_units($new_game, 50) }
  end
end

puts "done"