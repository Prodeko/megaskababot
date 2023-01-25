import { session, Telegraf, Telegram } from "telegraf";
import * as dotenv from 'dotenv';
import axios from "axios";
import * as fs from 'fs'

dotenv.config();

if (!process.env.BOT_TOKEN) {
    throw new Error("Bot token not defined!")
}

const bot = new Telegraf(process.env.BOT_TOKEN);

type Phase = 'year' | 'guild' | 'dist' | 'proof'

const users = new Map()
const conversationPhase = new Map<number, Phase>()


bot.command('entry', async (ctx, next) => {
    if(!users.has(ctx.message.from.id)) {
        conversationPhase.set(ctx.chat.id, 'year')
        ctx.reply('What is your freshman year?')
    } else {
        await ctx.sendMessage('Hey there! What distance did you travel')
        console.log(users.get(ctx.message.from.id))
        conversationPhase.set(ctx.chat.id, 'dist')
    }
})

bot.on('message', (ctx: any, next) => {
    const userId = ctx.message.from.id
    const chatId = ctx.chat?.id
    const text = ctx.update.message?.text
    // if(!chatId || !text) return

    switch (conversationPhase.get(chatId)) {
        case 'dist':
            if (!isNaN(parseInt(text))) {
                console.log(parseInt(text))
            }
            ctx.reply('Send proof as a picture')
            conversationPhase.set(chatId, 'proof')
            break

        case 'guild':
            users.set(userId,{
                ...users.get(userId),
                guild: text
            })
            console.log('Guild: ', text)
            conversationPhase.set(chatId, 'dist')
            ctx.reply('How much did you run?')
            break;
        
        case 'year':
            users.set(userId, {
                user: ctx.message.from,
                year: text
            })
            console.log('year', text)
            conversationPhase.set(chatId, 'guild')
            ctx.reply('From which guild are you?')
            break;
        
        case 'proof':
            const fileId = ctx.message?.photo[3].file_id
            console.log('FileId: ', fileId)
            ctx.telegram.getFileLink(fileId).then((url: string) => {    
                axios({url, responseType: 'stream'}).then(response => {
                    return new Promise((resolve, reject) => {
                        response.data.pipe(fs.createWriteStream(`photos/${ctx.update.message.from.id}.jpg`))
                                    .on('finish', () => console.log('succes'))
                                    .on('error', (e: any) => console.log('Error: ', e))
                            });
                        })
            })
            break;
    }
        
    return next()
})

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));