/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as fs from 'fs'
import _ from 'lodash'
import { MediaGroup } from 'telegraf/typings/telegram-types'

import { ActionContext, CommandContext, Entry, EntryWithUser } from '../common/types'
import { formatEntry, formatEntryWithUser } from '../common/utils'
import { isBigInteger, isEntry } from '../common/validators'
import {
  amountToValidate,
  fileIdsForUserId,
  fileIdsForUsername, getEntry,
  getRandomNotValidEntry,
  removeEntry,
  saveEntriesAsCSV,
  setEntryValidation,
  updateEntry
} from '../entries'
import { confirmationKeyboard, validationKeyboard } from '../keyboards'

const admins = new Set()
const underValidation = new Map<number, number>()
const removeConsideration = new Map<number, number>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const performPistokoe = async (ctx: ActionContext | CommandContext) => {
  const entry = await getRandomNotValidEntry()
  const chatId = ctx!.chat!.id

  if (!chatId) throw new Error('No chat id found')
  if (!entry) return await ctx.reply('No entries found')
  if (!isEntry(entry)) return await ctx.reply('Found entry is not an entry?')

  underValidation.set(chatId, entry.id)

  await notValidated(ctx)
  await ctx.replyWithHTML(formatEntryWithUser(entry as unknown as EntryWithUser))
  await ctx.replyWithPhoto(entry?.fileId, validationKeyboard)
}

export const notValidated = async (ctx: ActionContext | CommandContext) => {
  const notValidated = await amountToValidate()
  await ctx.reply(`Number of entries not validated: ${notValidated}`)
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

  await ctx.reply('Marked invalid')
  await performPistokoe(ctx)
}

export const valid = async (ctx: ActionContext) => {
  if (!admins.has(ctx!.from!.id)) return

  const entryId = underValidation.get(ctx!.chat!.id)
  if (!entryId) return

  await setEntryValidation(entryId, true)
  await ctx.editMessageReplyMarkup(undefined) // Clear inline keyboard

  await ctx.reply('Marked valid')
  await performPistokoe(ctx)
}

export const adminLogin = async (ctx: CommandContext) => {
  const userId = ctx.message.from.id
  admins.add(userId)
  await ctx.reply(
    'You are now an admin! \n/csv - get all entries in csv  \n/pistokoe - validate entries \n/remove [entry id] - remove one entry \n/numtovalidate - number of entries not yet validated \n/allphotos [user id or username] - gets all uploaded photos by user \n/updatedistance [entry id] [distance] - sets a new distance on an entry \n/resetvalidation [entry id] - resets the validation of entry'
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
  if (isBigInteger(possibleNum)) {
    fileIds = await fileIdsForUserId(possibleNum)
  } else {
    fileIds = await fileIdsForUsername(args[1])
  }

  if (!fileIds) return await ctx.reply('No such user 👀')

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

  await ctx.reply('Removed entry!')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cancelRemove = async (ctx: any) => {
  if (!admins.has(ctx.from.id)) return
  await ctx.editMessageReplyMarkup(undefined) // Clear inline keyboard
  removeConsideration.delete(ctx.chat.id)
  await ctx.reply('Canceled')
}

export const remove = async (ctx: CommandContext) => {
  if (!admins.has(ctx.from.id)) return

  const args = ctx.message.text.split(' ')
  if (args.length <= 1)
    return await ctx.reply('Please give the id to remove as an argument (eg. /remove 10)')

  const idToRemove = parseInt(args[1])

  if (isNaN(idToRemove)) return await ctx.reply('Given id is not a number!')

  try {
    const entry = await getEntry(idToRemove)
    removeConsideration.set(ctx.chat.id, entry.id)
    await ctx.replyWithPhoto(entry.fileId)
    await ctx.replyWithHTML(formatEntryWithUser(entry as unknown as EntryWithUser))
    await ctx.reply('Do you want to remove this entry?', confirmationKeyboard)
  } catch (e) {
    console.error(e)
    await ctx.reply('No such entry')
  }
}

export const csv = async (ctx: CommandContext) => {
  if (!admins.has(ctx.from.id)) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await saveEntriesAsCSV()
  ctx.telegram.sendDocument(ctx.from.id, {
    source: fs.readFileSync('entries.csv'),
    filename: 'entries.csv',
  })
}

export const resetValidation = async (ctx: CommandContext) => {
  if (!admins.has(ctx.from.id)) return

  const args = ctx.message.text.split(' ')
  if (args.length <= 1)
    return await ctx.reply('Please give the id to update as an argument (eg. /resetvalidation 10)')

  const idToReset = parseInt(args[1])

  if (isNaN(idToReset)) return await ctx.reply('Given id is not a number!')

  try {
    const entry = await updateEntry(idToReset, {
      valid: null
    })
    await ctx.reply(`Resetted valdation for entry ${entry.id}: \n${formatEntry(entry as unknown as Entry)}`)
  } catch (e) {
    console.log(e)
    await ctx.reply("That did not work! (Most likely there is no such entry)")
  }
}

export const setDistance = async (ctx: CommandContext) => {
  if (!admins.has(ctx.from.id)) return

  const args = ctx.message.text.split(' ')
  if (args.length <= 2)
    return await ctx.reply('Please give the id to update and new distance as an argument (eg. /setdistance 10 10.4)')

  const idToUpdate = parseInt(args[1])
  const distance = parseFloat(args[2].replace(",", "."))

  if (isNaN(idToUpdate) || isNaN(distance) || !(idToUpdate && distance)) return await ctx.reply('Either of the given arguments is not a number!')

  try {
    const entry = await updateEntry(idToUpdate, {
      distance
    })
    await ctx.reply(`Updated distance for entry ${entry.id}: \n${formatEntry(entry as unknown as Entry)}`)
  } catch (e) {
    console.log(e)
    await ctx.reply("That did not work! (Most likely there is no such entry)")
  }
}

export const stopValidation = async (ctx: ActionContext) => {
  underValidation.delete(ctx!.chat!.id)
}
