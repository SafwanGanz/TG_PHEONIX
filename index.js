const { Telegraf, Telegram } = require('telegraf');
const { message } = require('telegraf/filters');
const fs = require('fs')
const { useNewReplies } = require("telegraf/future")
const {
    bot_token
} = JSON.parse(fs.readFileSync('./config.json'))
const bot = new Telegraf(bot_token);
bot.use(useNewReplies())

Telegram.setM
bot.command('start', async(ctx) => {
        ctx.reply(`Hi 👋\n\nI am an AI Robot to answer your question, Please send your Question, later your answer will be answered by the robot.\n\n_AI (Artificial Intelligence) is a technology that uses complex algorithms to create machines that can think and act like man. AI can be used to solve complex problems and make more informed decisions than humans. AI can also be used to analyze data and make decisions based on it. AI can also be used to increase productivity and efficiency, as well as assist humans in completing complex tasks._\n\n_This bot is limited to a maximum of 0 words_\n\n*Created by @ajmal_x0*`)
        ctx.reply("You Have Not Registered\nPlease register to use the bot")
})
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))