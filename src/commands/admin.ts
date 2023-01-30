/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as fs from 'fs'
import _ from 'lodash'
import { MediaGroup } from 'telegraf/typings/telegram-types'

import { ActionContext, CommandContext, EntryWithUser } from '../common/types'
import { arrayToCSV, formatEntryWithUser } from '../common/utils'
import { isEntry } from '../common/validators'
import {
  amountToValidate,
  fileIdsForUserId,
  fileIdsForUsername,
  getAllEntries,
  getEntry,
  getRandomNotValidEntry,
  removeEntry,
  setEntryValidation,
} from '../entries'
import { confirmationKeyboard, validationKeyboard } from '../keyboards'

const admins = new Set()
const underValidation = new Map<number, number>()
const removeConsideration = new Map<number, number>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const performPistokoe = async (ctx: any) => {
  const entry = await getRandomNotValidEntry()
  const chatId = ctx!.chat!.id

  if (!chatId) throw new Error('No chat id found')
  if (!entry) return ctx.reply('No entries found')
  if (!isEntry(entry)) ctx.reply('Found entry is not an entry?')

  underValidation.set(chatId, entry.id)

  await notValidated(ctx)
  await ctx.replyWithHTML(formatEntryWithUser(entry as EntryWithUser))
  await ctx.replyWithPhoto(entry?.fileId, validationKeyboard)
}

export const notValidated = async (ctx: CommandContext) => {
  if (!admins.has(ctx.from.id)) return

  const notValidated = await amountToValidate()
  ctx.reply(`Amount of entries not validated: ${notValidated}`)
}

export const pistokoe = async (ctx: CommandContext) => {
  if (!admins.has(ctx.from.id)) return
  console.log('pistokoe')
  await performPistokoe(ctx)
}

export const invalid = async (ctx: ActionContext) => {
  if (!admins.has(ctx!.from!.id)) return

  const entryId = underValidation.get(ctx!.chat!.id)
  if (!entryId) return

  await setEntryValidation(entryId, false)
  await ctx.editMessageReplyMarkup(undefined) // Clear inline keyboard

  ctx.reply('Marked invalid')
  await performPistokoe(ctx)
}

export const valid = async (ctx: ActionContext) => {
  if (!admins.has(ctx!.from!.id)) return

  const entryId = underValidation.get(ctx!.chat!.id)
  if (!entryId) return

  await setEntryValidation(entryId, true)
  await ctx.editMessageReplyMarkup(undefined) // Clear inline keyboard

  ctx.reply('Marked valid')
  await performPistokoe(ctx)
}

export const adminLogin = (ctx: CommandContext) => {
  const userId = ctx.message.from.id
  admins.add(userId)
  ctx.reply(
    'You are now an admin! \n/csv - get all entries in csv  \n/pistokoe - validate entries \n/remove [id] - remove one entry \n/numtovalidate - number of entries not yet validated \n/allphotos [id or username] - gets all uploaded photos by user'
  )
}

export const allPhotosFromUser = async (ctx: CommandContext) => {
  if (!admins.has(ctx!.from!.id)) return
  const args = ctx.message.text.split(' ')

  if (args.length <= 1)
    return ctx.reply(
      'Please give the id or username to get all photos from as an argument (eg. /allphotos mediakeisari)'
    )

  const possibleNum = parseInt(args[1])

  let fileIds
  if (isNaN(possibleNum)) {
    fileIds = await fileIdsForUsername(args[1])
  } else {
    fileIds = await fileIdsForUserId(possibleNum)
  }

  if(!fileIds) return await ctx.reply("No such user 👀")

  const chunks = _.chunk(
    fileIds.map(f => ({ media: f.fileId, type: 'photo' })),
    10
  ) as MediaGroup[]

  chunks.forEach(async chunk => {
    try {
      await ctx.replyWithMediaGroup(chunk)
    } catch (e) {
      console.log(e)
      await ctx.reply('Possibily invalid fileId')
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const confirmedRemove = async (ctx: any) => {
  if (!admins.has(ctx.from.id)) return

  const entryId = removeConsideration.get(ctx.chat.id)
  if (!entryId) return
  await removeEntry(entryId)
  await ctx.editMessageReplyMarkup(undefined) // Clear inline keyboard
  removeConsideration.delete(ctx.chat.id)

  ctx.reply('Removed entry!')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cancelRemove = async (ctx: any) => {
  if (!admins.has(ctx.from.id)) return
  await ctx.editMessageReplyMarkup(undefined) // Clear inline keyboard
  removeConsideration.delete(ctx.chat.id)
  ctx.reply('Canceled')
}

export const remove = async (ctx: CommandContext) => {
  if (!admins.has(ctx.from.id)) return

  const args = ctx.message.text.split(' ')
  if (args.length <= 1)
    return ctx.reply('Please give the id to remove as an argument (eg. /remove 10)')

  const idToRemove = parseInt(args[1])

  if (isNaN(idToRemove)) return ctx.reply('Given id is not a number!')

  try {
    const entry = await getEntry(idToRemove)
    removeConsideration.set(ctx.chat.id, entry.id)
    await ctx.replyWithPhoto(entry.fileId)
    await ctx.replyWithHTML(formatEntryWithUser(entry as EntryWithUser))
    await ctx.reply('Do you want to remove this entry?', confirmationKeyboard)
  } catch (e) {
    console.error(e)
    ctx.reply('No such entry')
  }
}

export const csv = async (ctx: CommandContext) => {
  if (!admins.has(ctx.from.id)) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries = (await getAllEntries()) as any[]
  console.log(entries[0].user)
  const flattenedEntries = entries.map(e => ({
    ...e,
    ...e.user,
    user: undefined,
  }))
  const csv = arrayToCSV(flattenedEntries)
  fs.writeFileSync('entries.csv', csv)
  ctx.telegram.sendDocument(ctx.from.id, {
    source: fs.readFileSync('entries.csv'),
    filename: 'entries.csv',
  })
}

export const stopValidation = async (ctx: ActionContext) => {
  underValidation.delete(ctx!.chat!.id)
}
