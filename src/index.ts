import * as dotenv from 'dotenv'
import { Telegraf } from 'telegraf'

import { adminLogin, csv, invalid, pistokoe, stopValidation, valid } from './commands/admin'
import entries from './commands/entries'
import help from './commands/help'
import message from './commands/message'
import removeLatestCommand from './commands/removeLatest'
import start from './commands/start'

dotenv.config()

if (!process.env.BOT_TOKEN) {
  throw new Error('Bot token not defined!')
}

const bot = new Telegraf(process.env.BOT_TOKEN)

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

/* const portStr = process.env?.PORT
const port = portStr && !isNaN(parseInt(portStr)) ? parseInt(portStr) : undefined
 */
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
