import * as dotenv from 'dotenv'
import express from 'express'
import { Telegraf } from 'telegraf'

import { adminLogin, cancelRemove, confirmedRemove, csv, invalid, notValidated, pistokoe, remove, stopValidation, valid } from './commands/admin'
import entries from './commands/entries'
import entry from './commands/entry'
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
bot.command('entry', entry)
bot.command('removelatest', removeLatestCommand)

// Admin commands
bot.hears(process.env.ADMIN_PASSWORD ?? 'admin', adminLogin)
bot.command('csv', csv)
bot.command('pistokoe', pistokoe)
bot.command('numtovalidate', notValidated)
bot.command('remove', remove)

bot.hears('Invalid', invalid)
bot.hears('Valid', valid)
bot.hears('Stop validation', stopValidation)

bot.action('remove', confirmedRemove)
bot.action('cancel', cancelRemove)

// Message handling
bot.on('message', message)

//bot.launch(launchOptions)

// Necessary because of Azure App Service health check on startup
 app.get('/', (_req,res) => {
   res.send('Kovaa tulee')
})

app.listen(port, () => console.log('Running on port ', port))

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
