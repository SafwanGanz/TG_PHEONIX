const { Telegraf, Telegram } = require('telegraf');
const { message } = require('telegraf/filters');
const fs = require('fs')
const { useNewReplies } = require("telegraf/future")
const {
    bot_token
} = JSON.parse(fs.readFileSync('./config.json'))
const bot = new Telegraf(bot_token);
bot.use(useNewReplies())
bot.telegram.setMyCommands([
    { command: '/start', description: 'Start Command'} ,
    { command: '/help', description: 'Commands List'},
    { command: '/updates', description: 'Get bot updates'}
])
bot.command('start', async(ctx) => {
 ctx.reply(`Hai this is a bot`)
})
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
