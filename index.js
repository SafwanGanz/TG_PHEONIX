import { Telegraf, Telegram } from 'telegraf';
import { message } from 'telegraf/filters';
import { readFileSync } from 'fs';
import chalk from 'chalk';
import { useNewReplies } from "telegraf/future";
const {
    bot_token
} = JSON.parse(readFileSync('./config.json'))
const bot = new Telegraf(bot_token);
bot.use(useNewReplies())
bot.telegram.setMyCommands([
    { command: '/start', description: 'Start Command' },
    { command: '/help', description: 'Commands List' },
    { command: '/updates', description: 'Get bot updates' }
])
bot.on("new_chat_members", async (ctx) => {
    var message = ctx.message
    var groupname = message.chat.title
    for (const x of message.new_chat_members) {
    var pp_user = await getPhotoProfile(x.id)
    var full_name = getUser(x).full_name
    console.log(chalk.whiteBright("├"), chalk.cyanBright("[  JOINS  ]"), chalk.whiteBright(full_name), chalk.greenBright("join in"), chalk.whiteBright(groupname))
    ctx.replyWithPhoto(pp_user, { caption: `Hai ${full_name}!! Welcome To ${groupname}` })
    }
})

bot.on("left_chat_member", async (ctx) => {
    var message = ctx.message
    var groupname = message.chat.title
    var full_name = getUser(message.left_chat_member).full_name
    console.log(chalk.whiteBright("├"), chalk.cyanBright("[  LEAVE  ]"), chalk.whiteBright(full_name), chalk.greenBright("leave from"), chalk.whiteBright(groupname))
    ctx.reply(`Bye bye ${full_name}`)
})

bot.command('start', async (ctx) => {
    ctx.reply(`Hi 👋\n\nI am an AI Robot to answer your question, Please send your Question, later your answer will be answered by the robot.\n\n_AI (Artificial Intelligence) is a technology that uses complex algorithms to create machines that can think and act like man. AI can be used to solve complex problems and make more informed decisions than humans. AI can also be used to analyze data and make decisions based on it. AI can also be used to increase productivity and efficiency, as well as assist humans in completing complex tasks._\n\n_This bot is limited to a maximum of 0 words_\n\n*Created by @ajmal_x*`)
})
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

//Functions ------------------------------------


 async function getArgs(ctx) {
    try {
        var args = ctx.message.text
        args = args.split(" ")
        args.shift()
        return args
    } catch { return [] }
}

 function getUser(ctx) {
    try {
        var user = ctx
        var last_name = user["last_name"] || ""
        var full_name = user.first_name + " " + last_name
        user["full_name"] = full_name.trim()
        return user
    } catch (e) { throw e }
}

 async function getBot(ctx) {
    try {
        var bot = ctx.botInfo
        var last_name = bot["last_name"] || ""
        var full_name = bot.first_name + " " + last_name
        bot["full_name"] = full_name.trim()
        return bot
    } catch { return {} }
}

 async function getLink(file_id) { 
    try { 
        return (await bot.telegram.getFileLink(file_id)).href
    } catch {
        throw "Error while get url" 
    } 
}

 async function getPhotoProfile(id) {
    try {
        var url_default = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        if (String(id).startsWith("-100")) {
            var pp = await bot.telegram.getChat(id)
            if (!pp.hasOwnProperty("photo")) return url_default
            var file_id = pp.photo.big_file_id
        } else {
            var pp = await bot.telegram.getUserProfilePhotos(id)
            if (pp.total_count == 0) return url_default
            var file_id = pp.photos[0][2].file_id
        }
        return await getLink(file_id)
    } catch (e) { throw e }
}
