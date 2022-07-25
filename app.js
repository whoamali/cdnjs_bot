const Telegraf = require("telegraf").Telegraf;

const { start } = require("./commands/start");
const { search } = require("./commands/search");
const { errorCatch } = require("./errors/catch");

// Dotenv config
require("./utils/dotEnv");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Error handling
bot.catch(errorCatch);

// Start command
bot.start(start);

// Search module command
bot.on("text", search);

// Launch bot
bot.launch();
