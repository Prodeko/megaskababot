import * as dotenv from 'dotenv';
import { Markup, Telegraf } from "telegraf";
import { GUILDS, SPORTS, YEARS } from "./constants";
import { savePic } from "./db";
import { entryToDb, getEntries, updateEntryStash } from "./entries";
import { Phase } from "./types";
import { isUser, updateUsersStash, userToDb } from "./users";
import { isGuild, isSport } from './validators';

dotenv.config();

if (!process.env.BOT_TOKEN) {
    throw new Error("Bot token not defined!")
}

const bot = new Telegraf(process.env.BOT_TOKEN);

const conversationPhase = new Map<number, Phase>()

const guildKeyboard = Markup.keyboard(GUILDS).oneTime()
const yearKeyboard = Markup.keyboard(YEARS).oneTime()
const transpKeyboard = Markup.keyboard(SPORTS).oneTime()

bot.start(async (ctx, next) => {
    const userId = ctx.message.from.id
    if(!(await isUser(userId))) {
        conversationPhase.set(ctx.chat.id, 'year')
        updateUsersStash(userId, {
            firstName: ctx.message.from.first_name,
            lastName: ctx.message.from.last_name,
            telegramUsername: ctx.message.from.username,
            telegramUserId: ctx.message.from.id
        })
        ctx.reply('Welcome to megaskaba! You have not registered previously, so I\'ll ask a few questions first')
        ctx.reply('What is your freshman year?', yearKeyboard)
    } else {
        await ctx.reply('Welcome back! Did you ski or run/walk?', transpKeyboard)
        conversationPhase.set(ctx.chat.id, 'transp')
    }
})

bot.command('entries', async (ctx) => {
    const entries = await getEntries(ctx.message.from.id)
    ctx.reply(JSON.stringify(entries))
})

bot.on('message', (ctx: any, next) => {
    const chatId = ctx.chat?.id
    const text = ctx.update.message?.text
    const userId = ctx.update.message.from.id

    switch (conversationPhase.get(chatId)) {
        case 'year':
            const asNum = parseFloat(text)    
            if (isNaN(asNum)) {
                ctx.reply('That is not a number')
            }
    
            updateUsersStash(userId, {freshmanYear: asNum})
            ctx.reply('From which guild are you?', guildKeyboard)
            conversationPhase.set(chatId, 'guild')
            break

        case 'guild':
            if(isGuild(text)){
                updateUsersStash(userId, {guild: text})
                userToDb(userId)
                ctx.reply('Your user data has now been saved! Did you ski or run/walk?', transpKeyboard)
                conversationPhase.set(chatId, 'transp')
            } else {
                ctx.reply('Please give a proper guild')
            }
            break

        case 'transp':
            if(isSport(text)) {
                updateEntryStash(chatId, {sport: text})
                ctx.reply(`What distance (km) did you ${text}?`)
                conversationPhase.set(chatId, 'dist')
            } else {
                ctx.reply('Please give a proper transportation method')
            }
            break
            
        case 'dist':
            const distance = parseFloat(text)
            if (!isNaN(distance) && distance > 0 ) {
                updateEntryStash(chatId, {
                    userId,
                    distance,
                })
                ctx.reply("Please give proof as a picture")
                conversationPhase.set(chatId, 'proof')
            } else {
                ctx.reply("Please give a positive number?")
            }
            break
        
        case 'proof':
            try {                
                const fileId = ctx.message?.photo[3].file_id
                savePic(ctx, fileId)
                updateEntryStash(chatId, {fileId})
                entryToDb(chatId)
                ctx.reply('Well done!')
            } catch {
                ctx.reply('That did not work. Please try again')
            }
            break;
    }
        
    return next()
})

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));