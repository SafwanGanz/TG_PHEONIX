import { Telegraf, Telegram } from 'telegraf';
import { message } from 'telegraf/filters';
import { readFileSync } from 'fs';
import cp from 'child_process'
import { promisify } from 'util'
import chalk from 'chalk';
import fs from 'fs'
import { useNewReplies } from "telegraf/future";
const {
    bot_token,
    bot_prefix
} = JSON.parse(readFileSync('./config.json'))
if (bot_token == "") {
    console.log(chalk.redBright('Pleas Add Your Bot token in config.json'))
}
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
    var name = ctx.first_name
    ctx.reply(`
ʜᴇy ${name}!..

━━━━━━━━━━━━━━━━━━━━━━━━━

❏ ᴛʜɪꜱ ɪꜱ ᴀ ɢʀᴏᴜᴩ ᴍᴀɴᴀɢᴇᴍᴇɴᴛ ᴀɪ ʙᴏᴛ
❏ ᴀʟᴏɴɢ ᴡɪᴛʜ ᴛʜᴇ ʙᴀꜱɪᴄ ꜰᴇᴀᴛᴜʀᴇꜱ, ɪᴛ ᴀʟꜱᴏ ɪɴᴄʟᴜᴅᴇꜱ ꜱᴏᴍᴇ ɪɴᴛᴇʀᴇꜱᴛɪɴɢ ꜰᴇᴀᴛᴜʀᴇꜱ
`)
})
bot.on("message", async (ctx) => {
    const body = ctx.message.text || ctx.message.caption || ""
    var comm = body.trim().split(" ").shift().toLowerCase()
    var cmd = false
    if (bot_prefix != "" && body.startsWith(bot_prefix)) {
        cmd = true
        comm = body.slice(1).trim().split(" ").shift().toLowerCase()
    }
    const command = comm
    const args = await getArgs(ctx)
    const user = getUser(ctx.message.from)
    const isCmd = cmd
    const isGroup = ctx.chat.type.includes("group")
    const groupName = isGroup ? ctx.chat.title : ""

    const isImage = ctx.message.hasOwnProperty("photo")
    const isVideo = ctx.message.hasOwnProperty("video")
    const isAudio = ctx.message.hasOwnProperty("audio")
    const isSticker = ctx.message.hasOwnProperty("sticker")
    const isContact = ctx.message.hasOwnProperty("contact")
    const isLocation = ctx.message.hasOwnProperty("location")
    const isDocument = ctx.message.hasOwnProperty("document")
    const isAnimation = ctx.message.hasOwnProperty("animation")
    const isMedia = isImage || isVideo || isAudio || isSticker || isContact || isLocation || isDocument || isAnimation

    const quotedMessage = ctx.message.reply_to_message || {}
    const isQuotedImage = quotedMessage.hasOwnProperty("photo")
    const isQuotedVideo = quotedMessage.hasOwnProperty("video")
    const isQuotedAudio = quotedMessage.hasOwnProperty("audio")
    const isQuotedSticker = quotedMessage.hasOwnProperty("sticker")
    const isQuotedContact = quotedMessage.hasOwnProperty("contact")
    const isQuotedLocation = quotedMessage.hasOwnProperty("location")
    const isQuotedDocument = quotedMessage.hasOwnProperty("document")
    const isQuotedAnimation = quotedMessage.hasOwnProperty("animation")
    const isQuoted = ctx.message.hasOwnProperty("reply_to_message")

    var typeMessage = body.substr(0, 50).replace(/\n/g, '')
    if (isImage) typeMessage = "Image"
    else if (isVideo) typeMessage = "Video"
    else if (isAudio) typeMessage = "Audio"
    else if (isSticker) typeMessage = "Sticker"
    else if (isContact) typeMessage = "Contact"
    else if (isLocation) typeMessage = "Location"
    else if (isDocument) typeMessage = "Document"
    else if (isAnimation) typeMessage = "Animation"

    logFunction(isGroup, isCmd, typeMessage, user, groupName);
    var file_id = ""
    file_id = newFunction(isQuoted, file_id, isQuotedImage, isQuotedVideo, isQuotedAudio, isQuotedDocument, isQuotedAnimation);
    var mediaLink = file_id != "" ? await tele.getLink(file_id) : ""
    switch (command) {
        case 'help':
            ctx.reply('Adding basic features!...')
            break
        case 'gpt':
        case 'bot':
            if (chat.gpt === true) {

            } else {
                ctx.reply('pleas turn on chatbot mod\n/on chatbot')
            }

    }

})

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

//Functions ------------------------------------

function logFunction(isGroup, isCmd, typeMessage, user, groupName) {
    if (!isGroup && !isCmd)
        console.log(chalk.whiteBright("├"), chalk.cyanBright("[ PRIVATE ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name));
    if (isGroup && !isCmd)
        console.log(chalk.whiteBright("├"), chalk.cyanBright("[  GROUP  ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName));
    if (!isGroup && isCmd)
        console.log(chalk.whiteBright("├"), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name));
    if (isGroup && isCmd)
        console.log(chalk.whiteBright("├"), chalk.cyanBright("[ COMMAND ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.whiteBright(user.full_name), chalk.greenBright("in"), chalk.whiteBright(groupName));
}


function newFunction(isQuoted, file_id, isQuotedImage, isQuotedVideo, isQuotedAudio, isQuotedDocument, isQuotedAnimation) {
    if (isQuoted) {
        file_id = isQuotedImage ? ctx.message.reply_to_message.photo[ctx.message.reply_to_message.photo.length - 1].file_id :
            isQuotedVideo ? ctx.message.reply_to_message.video.file_id :
                isQuotedAudio ? ctx.message.reply_to_message.audio.file_id :
                    isQuotedDocument ? ctx.message.reply_to_message.document.file_id :
                        isQuotedAnimation ? ctx.message.reply_to_message.animation.file_id : "";
    }
    return file_id;
}

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
