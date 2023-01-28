import * as dotenv from 'dotenv';
import { Context, Markup, Telegraf } from "telegraf";
import { GUILDS, SPORTS, YEARS } from "./constants";
import { savePic } from "./db";
import { entryToDb, getAllEntries, getEntries, getRandomNotValidEntry, removeLatest, setEntryValidation, updateEntryStash } from "./entries";
import { Entry, EntryWithUser, Phase, User } from "./types";
import { isUser, updateUsersStash, userToDb } from "./users";
import { arrayToCSV, formatEntry, formatEntryWithUser } from './utils';
import { isEntry, isGuild, isSport } from './validators';
import * as fs from 'fs'

dotenv.config();

if (!process.env.BOT_TOKEN) {
    throw new Error("Bot token not defined!")
}

const bot = new Telegraf(process.env.BOT_TOKEN);

const conversationPhase = new Map<number, Phase>()
const admins = new Set()
const underValidation = new Map<number, number>()


const guildKeyboard = Markup.keyboard(GUILDS).oneTime()
const yearKeyboard = Markup.keyboard(YEARS).oneTime()
const transpKeyboard = Markup.keyboard(SPORTS).oneTime().resize()
const validationKeyboard = Markup.keyboard(["Valid", "Invalid"]).oneTime().resize()

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
    if(entries.length > 0){
        const points = entries.map(e => e.distance * (e.sport === "ski" ? 1 : 1.5)).reduce((p, e) => p+e, 0)
        ctx.reply(entries.map(formatEntry).concat([`Total points: ${points}`]).join("\n\n"))
    } else {
        ctx.reply("No entries yet!")
    }
})

bot.command('help', (ctx => {
    ctx.reply("Type /start to log in or add a new entry\n\nType /entries to get a list of your entries")
}))

bot.command('removeLatest', async (ctx) => {
    const result = await removeLatest(ctx.from.id)
    if(result) {
        ctx.reply("Removed latest entry!")
    } else {
        ctx.reply("No entries to remove")
    }
})

bot.hears(process.env.ADMIN_PASSWORD ?? "admin", ctx => {
    const userId = ctx.message.from.id
    admins.add(userId)
    ctx.reply("You are now an admin! Send /csv to get all entries in csv or /pistokoe to examine one entry")
})

bot.command("csv", async ctx => {
    if(!admins.has(ctx.from.id)) return

    const entries = (await getAllEntries()) as any[]
    console.log(entries[0].user)
    const flattenedEntries = entries.map(e => ({
        ...e,
        ...e.user,
        user: undefined
    }))
    const csv = arrayToCSV(flattenedEntries)
    fs.writeFileSync("entries.csv", csv)
    ctx.telegram.sendDocument(ctx.from.id, 
    {source: fs.readFileSync("entries.csv"), filename: "entries.csv"},)
})

const pistokoe = async (ctx: Context) => {
    const entry = (await getRandomNotValidEntry())
    const chatId = ctx?.chat?.id ?? ctx.message?.chat.id

    if(!chatId) throw new Error("No chat id found")
    if(!entry) return ctx.reply("No entries found")
    if(!isEntry(entry)) ctx.reply("Found entry is not an entry?")

    underValidation.set(chatId, entry.id)

    ctx.replyWithHTML(formatEntryWithUser(entry as EntryWithUser))
    ctx.replyWithPhoto(entry?.fileId, validationKeyboard)
}

bot.command('pistokoe', async ctx => {
    if(!admins.has(ctx.from.id)) return
    console.log('pistokoe')
    await pistokoe(ctx)
})

bot.hears('Invalid',async (ctx) => {
    const entryId = underValidation.get(ctx.chat.id)
    if(!entryId) return
    
    await setEntryValidation(entryId, false)
    
    ctx.reply("Marked invalid")
    await pistokoe(ctx)
})

bot.hears('Valid', async (ctx) => {
    const entryId = underValidation.get(ctx.chat.id)
    if(!entryId) return

    await setEntryValidation(entryId, true)
    ctx.reply("Marked valid")
    await pistokoe(ctx)
})

bot.hears('Stop validation', async (ctx) => {
    underValidation.delete(ctx.chat.id)
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

const portStr = process.env?.PORT
const port = portStr && !isNaN(parseInt(portStr)) ? parseInt(portStr) : undefined

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));