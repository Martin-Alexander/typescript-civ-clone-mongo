class MongoidColourfulLogger < Logger
  def initialize(output)
    super(output)
    self.level = Logger::DEBUG
    self.formatter = proc do |severity, datetime, progname, message|
      query_portion = message.split(" | ")[-1]
      begin
        if message.split(" | ")[3] == "STARTED"
          if message.split(" | ")[4].include?("{\"find")
            new_message = "#{message.split(' | ')[0...-1].join(' | ')} | \e[1;94m#{query_portion}\e[0;97m"
          elsif message.split(" | ")[4].include?("{\"update")
            new_message = "#{message.split(' | ')[0...-1].join(' | ')} | \e[1;93m#{query_portion}\e[0;97m"
          else
            new_message = query_portion
          end
          "#{new_message}\n"
        else
          "#{message}\n"
        end
      rescue
        "#{message}\n"
      end
    end
  end
end

Mongoid.logger = MongoidColourfulLogger.new(STDOUT) if ENV["RAILS_ENV"] == "development"