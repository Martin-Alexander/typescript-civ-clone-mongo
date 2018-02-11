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
$__civ_clone_mongo_seed__option = ENV["options"] || "default"
if !(allowed_options.include?($__civ_clone_mongo_seed__option) || $__civ_clone_mongo_seed__option.nil?)
  raise SeedError::InvalidOptionError, "Invalid option: #{$__civ_clone_mongo_seed__option}"
end

puts "Seeding with `#{$__civ_clone_mongo_seed__option}` option..."

seed_task "Clearing database" do
  User.destroy_all
  Player.destroy_all
  Game.destroy_all
end

if $__civ_clone_mongo_seed__option == "clean"
  "Clean seed"
else
  seed_task "Creating users" do
    $__civ_clone_mongo_seed__martin = User.create! username: "martin", password: "123456"
    $__civ_clone_mongo_seed__sophie = User.create! username: "sophie", password: "123456"
    $__civ_clone_mongo_seed__chloe = User.create! username: "chloe", password: "123456"
    $__civ_clone_mongo_seed__brittany = User.create! username: "brittany", password: "123456"
  end

  seed_task "Creating players" do
    $__civ_clone_mongo_seed__new_game = Game.create! state: "lobby"
  end

  seed_task "Creating games" do
    Player.create! user: $__civ_clone_mongo_seed__martin, game: $__civ_clone_mongo_seed__new_game, host: true
    Player.create! user: $__civ_clone_mongo_seed__sophie, game: $__civ_clone_mongo_seed__new_game
    Player.create! user: $__civ_clone_mongo_seed__chloe, game: $__civ_clone_mongo_seed__new_game
    Player.create! user: $__civ_clone_mongo_seed__brittany, game: $__civ_clone_mongo_seed__new_game
  end
  seed_task("Starting game") { $__civ_clone_mongo_seed__new_game.start }
  seed_task("Generating board") { $__civ_clone_mongo_seed__new_game.generate_game_data }
  if $__civ_clone_mongo_seed__option == "spam"
    seed_task("Spamming board with units") { generate_units($__civ_clone_mongo_seed__new_game, 50) }
  end
end

puts "done"