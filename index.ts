import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import * as dotenv from 'dotenv';
import { isMessage } from "./validators";

dotenv.config();

if (!process.env.BOT_TOKEN) {
    throw new Error("Bot token not defined!")
}

const bot = new Telegraf(process.env.BOT_TOKEN);

let chatsWaiting = new Set()


bot.command('entry', async (ctx, next) => {
    chatsWaiting.add(ctx.chat.id)
    await ctx.sendMessage('Hey there! What distance did you travel')
})

bot.on('message', (ctx: any, next) => {
    const number = parseInt(ctx.update.message?.text)
    if(chatsWaiting.has(ctx.chat.id) && !isNaN(number)){
        console.log(number)
        chatsWaiting.delete(ctx.chat.id)
        ctx.reply(`Number: ${number}`)
    } else if (chatsWaiting.has(ctx.chat.id)) {
        ctx.reply('Not a number')
    }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));