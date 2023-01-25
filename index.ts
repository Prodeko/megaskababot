import { Telegraf, Markup } from "telegraf";
import * as dotenv from 'dotenv';
import axios from "axios";
import * as fs from 'fs'
import { v4 } from 'uuid'

dotenv.config();

if (!process.env.BOT_TOKEN) {
    throw new Error("Bot token not defined!")
}

const bot = new Telegraf(process.env.BOT_TOKEN);

type Phase = 'year' | 'guild' | 'dist' | 'proof'

const GUILDS = ['prodeko', 'athene', 'fyysikkokilta']
const YEARS = ["15", "16", "17", "18", "19", "20", "21", "22"]
const TRANSP = ["foot", "ski"]

const users = new Map()
const entries = new Map()
const entryIds = new Map()
const conversationPhase = new Map<number, Phase>()

const guildKeyboard = Markup.inlineKeyboard(GUILDS.map(g => 
      Markup.button.callback(g, g)
))

const yearKeyboard = Markup.inlineKeyboard(YEARS.map(g => 
    Markup.button.callback(g, g)
))

const transpKeyboard = Markup.inlineKeyboard(TRANSP.map(g => 
    Markup.button.callback(g, g)
))

bot.command('entry', async (ctx, next) => {
    entryIds.set(ctx.chat.id, v4())
    if(!users.has(ctx.message.from.id)) {
        conversationPhase.set(ctx.chat.id, 'year')
        ctx.reply('What is your freshman year?', yearKeyboard)
    } else {
        await ctx.sendMessage('Hey there! What distance did you travel')
        conversationPhase.set(ctx.chat.id, 'dist')
    }
})

GUILDS.forEach(guild => {
    bot.action(guild, (ctx, next) => {
        const userId = ctx.update.callback_query.from.id
        const chatId = ctx.update.callback_query.message?.chat.id
        users.set(ctx.update.callback_query.from.id, {
            ...users.get(userId),
            guild
        })
        ctx.reply('How much did you run?')
        if (!chatId) return ctx.reply('No chat id?')
        conversationPhase.set(chatId, 'dist')
        return next()
    })
})

YEARS.forEach(year => {
    bot.action(year, (ctx, next) => {
        const userId = ctx.update.callback_query.from.id
        users.set(ctx.update.callback_query.from.id, {
            ...users.get(userId),
            year
        })
        ctx.reply('From which guild are you?', guildKeyboard)
        return next()
    })
})

TRANSP.forEach(transp => {
    bot.action(transp, (ctx, next) => {
        const chatId = ctx.update.callback_query.message?.chat.id
        const entryId = entryIds.get(chatId)
        if (!chatId) return ctx.reply('No chat id?')

        entries.set(entryId, {
            ...entries.get(entryId),
            transp
        })

        ctx.reply('Send proof as a picture')
        conversationPhase.set(chatId, 'proof')

        return next()
    })
})


bot.on('message', (ctx: any, next) => {
    const chatId = ctx.chat?.id
    const text = ctx.update.message?.text
    const userId = ctx.update.message.from.id
    switch (conversationPhase.get(chatId)) {
        case 'dist':
            if (!isNaN(parseInt(text))) {
                entries.set(entryIds.get(chatId), {
                    userId,
                    distance: parseInt(text)
                })
                ctx.reply("What form of transport?", transpKeyboard)
            }
            break
        
        case 'proof':
            const fileId = ctx.message?.photo[3].file_id
            console.log('FileId: ', fileId)
            ctx.telegram.getFileLink(fileId).then((url: string) => {    
                axios({url, responseType: 'stream'}).then(response => {
                    return new Promise((resolve, reject) => {
                        response.data.pipe(fs.createWriteStream(`photos/${fileId}.jpg`))
                                    .on('finish', () => console.log('succes'))
                                    .on('error', (e: any) => console.log('Error: ', e))
                            });
                        })
            })
            
            entries.set(entryIds.get(chatId), {
                ...entries.get(entryIds.get(chatId)),
                fileId
            })
            
            fs.writeFile("users.json", JSON.stringify(Array.from(users.values())), (e) => console.log(e))
            fs.writeFile("entries.json", JSON.stringify(Array.from(entries.values())), (e) => console.log(e))

            break;
    }
        
    return next()
})

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));