const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const fs = require('fs')
const {
    bot_token,
    mongo_url
} = JSON.parse(fs.readFileSync('./config.json'))
const bot = new Telegraf(bot_token);
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))