import { Telegraf } from 'telegraf'
import { bot_token } from "../config.json"
const bots = new Telegraf(bot_token)

export async function getArgs(ctx) {
    try {
        args = ctx.message.text
        args = args.split(" ")
        args.shift()
        return args
    } catch { return [] }
}

export function getUser(ctx) {
    try {
        user = ctx
        last_name = user["last_name"] || ""
        full_name = user.first_name + " " + last_name
        user["full_name"] = full_name.trim()
        return user
    } catch (e) { throw e }
}

export async function getBot(ctx) {
    try {
        bot = ctx.botInfo
        last_name = bot["last_name"] || ""
        full_name = bot.first_name + " " + last_name
        bot["full_name"] = full_name.trim()
        return bot
    } catch { return {} }
}

export async function getLink(file_id) { try { return (await bots.telegram.getFileLink(file_id)).href } catch { throw "Error while get url" } }

export async function getPhotoProfile(id) {
    try {
        url_default = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
        if (String(id).startsWith("-100")) {
            var pp = await bots.telegram.getChat(id)
            if (!pp.hasOwnProperty("photo")) return url_default
            file_id = pp.photo.big_file_id
        } else {
            var pp = await bots.telegram.getUserProfilePhotos(id)
            if (pp.total_count == 0) return url_default
            file_id = pp.photos[0][2].file_id
        }
        return await this.getLink(file_id)
    } catch (e) { throw e }
}
