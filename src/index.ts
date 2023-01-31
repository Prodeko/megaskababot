import * as dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
import { onPrivacyAccepted, onPrivacyRejected } from './commands/action/privacy'

import { adminLogin, allPhotosFromUser, cancelRemove, confirmedRemove, csv, invalid, notValidated, pistokoe, remove, stopValidation, valid } from './commands/admin'
import entries from './commands/entries'
import entry from './commands/entry'
import help from './commands/help'
import photo from './commands/photo'
import removeLatestCommand from './commands/removeLatest'
import start from './commands/start'
import text from './commands/text'
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

// Middleware to get stickerids
// eslint-disable-next-line prefer-const
// let fileIds: string[] = []
// bot.use((ctx:any, next) => {
//   if (!ctx?.message?.sticker) return next()
//   const fileId = ctx?.message?.sticker?.file_id
//   fileIds.push(fileId)
//   console.log(fileIds)
//   return next()
// })

// Admin commands
bot.hears(process.env.ADMIN_PASSWORD ?? 'admin', adminLogin)
bot.command('csv', csv)
bot.command('pistokoe', pistokoe)
bot.command('numtovalidate', notValidated)
bot.command('remove', remove)
bot.command('allphotos', allPhotosFromUser)

bot.action('invalid', invalid)
bot.action('valid', valid)
bot.action('stopvalidation', stopValidation)

bot.action('remove', confirmedRemove)
bot.action('cancel', cancelRemove)

bot.action('entry', entry)
bot.action('entries', entries)
bot.action('removelatest', removeLatestCommand)
bot.action('help', help)


// Message handling
bot.on('text', text)
bot.on('photo', photo)

// Inline keyboard handling
bot.action('accepted', onPrivacyAccepted)

bot.action('rejected', onPrivacyRejected)

bot.on('chosen_inline_result', ctx => ctx.editMessageReplyMarkup(undefined) )


// Launch bot 
launchBotDependingOnNodeEnv(bot)

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
