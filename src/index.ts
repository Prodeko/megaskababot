import * as dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
import express from 'express'

import { adminLogin, csv, invalid, pistokoe, stopValidation, valid } from './commands/admin'
import entries from './commands/entries'
import help from './commands/help'
import message from './commands/message'
import removeLatestCommand from './commands/removeLatest'
import start from './commands/start'

dotenv.config()
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const port = parseInt(process.env.PORT!)

const app = express();

if (!process.env.BOT_TOKEN) {
  throw new Error('Bot token not defined!')
}

const bot = new Telegraf(process.env.BOT_TOKEN)

// Workaround to avoid issue with TSconfig
const createWebhookListener = async () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  app.use(await bot.createWebhook({domain: process.env.DOMAIN!}))
}
createWebhookListener()

bot.start(start)

// Standard commands
bot.command('entries', entries)
bot.command('help', help)
bot.command('removeLatest', removeLatestCommand)

// Admin commands
bot.hears(process.env.ADMIN_PASSWORD ?? 'admin', adminLogin)
bot.command('csv', csv)
bot.command('pistokoe', pistokoe)
bot.hears('Invalid', invalid)
bot.hears('Valid', valid)
bot.hears('Stop validation', stopValidation)

// Message handling
bot.on('message', message)

// bot.launch(launchOptions)

// Necessary because of Azure App Service health check on startup
app.get('/', (_req,res) => {
  res.send('Kovaa tulee')
})

app.listen(port, () => console.log('Running on port ', port))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
