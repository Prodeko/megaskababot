import * as dotenv from 'dotenv';
import { Markup, Telegraf } from "telegraf";
import { GUILDS, TRANSP, YEARS } from "./constants";
import { savePic } from "./db";
import { entriesToDb, initEntryId, updateEntryStash } from "./entries";
import { Phase } from "./types";
import { isUser, updateUsersStash, usersToDb } from "./users";

dotenv.config();

if (!process.env.BOT_TOKEN) {
    throw new Error("Bot token not defined!")
}

const bot = new Telegraf(process.env.BOT_TOKEN);

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

bot.start(async (ctx, next) => {
    initEntryId(ctx.chat.id)
    if(!isUser(ctx.message.from.id)) {
        conversationPhase.set(ctx.chat.id, 'year')
        ctx.reply('What is your freshman year?', yearKeyboard)
    } else {
        await ctx.reply('Welcome back! What distance did you travel')
        conversationPhase.set(ctx.chat.id, 'dist')
    }
})

GUILDS.forEach(guild => {
    bot.action(guild, (ctx, next) => {
        const userId = ctx.update.callback_query.from.id
        const chatId = ctx.update.callback_query.message?.chat.id

        updateUsersStash(userId, {guild})
        ctx.reply('Your user data has now been saved! What distance did you travel?')

        if (!chatId) return ctx.reply('No chat id?')

        conversationPhase.set(chatId, 'dist')
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

        updateEntryStash(chatId, {transp})

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
            const distance = parseFloat(text)
            if (!isNaN(distance) && distance > 0 ) {
                updateEntryStash(chatId, {
                    userId,
                    distance,
                })
                ctx.reply("What form of transport?", transpKeyboard)
            } else {
                ctx.reply("Please give a positive number?")
            }
            break
        
        case 'proof':
            const fileId = ctx.message?.photo[3].file_id
            savePic(ctx, fileId)
            updateEntryStash(chatId, {fileId})
            entriesToDb()
            usersToDb()
            ctx.reply('Well done!')
            break;
    }
        
    return next()
})

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));