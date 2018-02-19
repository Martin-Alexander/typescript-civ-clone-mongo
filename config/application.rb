require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
# require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"
require "rails/test_unit/railtie"

require 'logger'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module CivCloneMongo
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1
    # config.eager_load_paths += %W(#{config.root}/lib/a_star)
    # config.eager_load_paths += %W(#{config.root}/lib/rules)
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    if ENV["RAILS_ENV"] == "development"
      logger = Logger.new(STDOUT)
      logger.level = Logger::DEBUG
      logger.formatter = proc do |severity, datetime, progname, message|
        query_portion = message.split(" | ")[-1]
        begin
          if message.split(" | ")[3] == "STARTED"
            if message.split(" | ")[4].include?("{\"find")
              new_message = "#{message.split(' | ')[0...-1]} | \e[1;94m#{query_portion}\e[0;97m"
            elsif message.split(" | ")[4].include?("{\"update")
              new_message = "#{message.split(' | ')[0...-1]} | \e[1;93m#{query_portion}\e[0;97m"
            else
              new_message = query_portion
            end
            "QUERY | #{new_message}\n"
          # elsif message.split(" | ")[3] == "SUCCEEDED"
          #   ""
          else
            "#{message}\n"
          end
        rescue
          "#{message}\n"
        end
      end

      Mongoid.logger = logger
    end
  end
end