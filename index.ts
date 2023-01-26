import * as dotenv from 'dotenv';
import { Markup, Telegraf } from "telegraf";
import { GUILDS, TRANSP, YEARS } from "./constants";
import { savePic } from "./db";
import { entriesToDb, initEntryId, updateEntryStash } from "./entries";
import { Phase } from "./types";
import { isUser, updateUsersStash, usersToDb } from "./users";
import { isGuild, isTransp } from './validators';

dotenv.config();

if (!process.env.BOT_TOKEN) {
    throw new Error("Bot token not defined!")
}

const bot = new Telegraf(process.env.BOT_TOKEN);

const conversationPhase = new Map<number, Phase>()

const guildKeyboard = Markup.keyboard(GUILDS.map(g => 
    Markup.button.callback(g, g)
)).oneTime()

const yearKeyboard = Markup.keyboard(YEARS.map(g => 
    Markup.button.callback(g, g)
)).oneTime()

const transpKeyboard = Markup.keyboard(TRANSP.map(g => 
    Markup.button.callback(g, g)
)).oneTime()

bot.start(async (ctx, next) => {
    initEntryId(ctx.chat.id)
    if(!isUser(ctx.message.from.id)) {
        conversationPhase.set(ctx.chat.id, 'year')
        ctx.reply('Welcome to megaskaba! You have not registered previously, so I\'ll ask a few questions first')
        ctx.reply('What is your freshman year?', yearKeyboard)
    } else {
        await ctx.reply('Welcome back! Did you ski or run/walk?', transpKeyboard)
        conversationPhase.set(ctx.chat.id, 'transp')
    }
})

GUILDS.forEach(guild => {
    bot.action(guild, (ctx, next) => {
        const userId = ctx.update.callback_query.from.id
        const chatId = ctx.update.callback_query.message?.chat.id


        return next()
    })
})

YEARS.forEach(year => {
    bot.action(year, (ctx, next) => {
        const asNum = parseFloat(year)
        const userId = ctx.update.callback_query.from.id

        if (isNaN(asNum)) throw new Error('Year is not a number!')

        updateUsersStash(userId, {year: asNum})

        ctx.reply('From which guild are you?', guildKeyboard)
        return next()
    })
})

TRANSP.forEach(transp => {
    bot.action(transp, (ctx, next) => {
        const chatId = ctx.update.callback_query.message?.chat.id
        if (!chatId) return ctx.reply('No chat id?')


    })
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
    
            updateUsersStash(userId, {year: asNum})
            ctx.reply('From which guild are you?', guildKeyboard)
            conversationPhase.set(chatId, 'guild')
            break

        case 'guild':
            if(isGuild(text)){
                updateUsersStash(userId, {guild: text})
                ctx.reply('Your user data has now been saved! Did you ski or run/walk?', transpKeyboard)
                conversationPhase.set(chatId, 'transp')
            } else {
                ctx.reply('Please give a proper guild')
            }
            break

        case 'transp':
            if(isTransp(text)) {
                updateEntryStash(chatId, {transp: text})
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
                entriesToDb()
                usersToDb()
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