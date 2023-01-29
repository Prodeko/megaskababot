import * as dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
import { onPrivacyAccepted, onPrivacyRejected } from './commands/action/privacy'

import { adminLogin, cancelRemove, confirmedRemove, csv, invalid, notValidated, pistokoe, remove, stopValidation, valid } from './commands/admin'
import entries from './commands/entries'
import entry from './commands/entry'
import help from './commands/help'
import message from './commands/message'
import removeLatestCommand from './commands/removeLatest'
import start from './commands/start'
import launchBotDependingOnNodeEnv from './launchBotDependingOnNodeEnv'

dotenv.config()

if (!process.env.BOT_TOKEN) {
  throw new Error('Bot token not defined!')
}

const bot = new Telegraf(process.env.BOT_TOKEN)

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

// Inline keyboard handling
bot.action('accepted', onPrivacyAccepted)
bot.action('rejected', onPrivacyRejected)

// Launch bot 
launchBotDependingOnNodeEnv(bot)

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
