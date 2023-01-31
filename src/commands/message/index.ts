import _ from 'lodash'
import { STICKERS, YEARS } from '../../common/constants'
import { isGuild, isSport } from '../../common/validators'
import { conversationPhase } from '../../common/variables'
import { entryToDb, updateEntryStash } from '../../entries'
import { commandsKeyboard, guildKeyboard } from '../../keyboards'
import { updateUsersStash, userToDb } from '../../users'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const message = async (ctx: any, next: () => Promise<void>) => {
  const chatId = ctx.chat?.id
  const text = ctx.update.message?.text
  const userId = ctx.update.message.from.id
  console.log("Phase: ", conversationPhase.get(chatId))
  switch (conversationPhase.get(chatId)) {
    case 'year':
      const asNum = parseFloat(text)
      if (!YEARS.includes(text)) {
        await ctx.reply('Please give a number beatween 1950 - 2023 👀')
      }

      updateUsersStash(userId, { freshmanYear: asNum })
      await ctx.reply('From which guild are you?', guildKeyboard)
      conversationPhase.set(chatId, 'guild')
      break

    case 'guild':
      const lower = _.lowerCase(text)
      if (isGuild(lower)) {
        updateUsersStash(userId, { guild: lower})
        await userToDb(userId)
        conversationPhase.delete(chatId)
        await ctx.reply("User data saved 💾!", commandsKeyboard)
      } else {
        await ctx.reply('Please give a proper guild')
      }
      break

    case 'transp':
      console.log(text)
      if (isSport(text)) {
        updateEntryStash(chatId, { sport: text })
        await ctx.reply(`What distance (km) did you ${text}?`)
        conversationPhase.set(chatId, 'dist')
      } else {
        await ctx.reply('Please give a proper transportation method')
      }
      break

    case 'dist':
      if(!text) {
        await ctx.reply("Please input text 👀")
        break
      }

      const distance = parseFloat(text.replace(",", "."))
      if (!isNaN(distance) && distance > 0 && distance < 1000) {
        updateEntryStash(chatId, {
          userId,
          distance,
        })
        await ctx.reply('Please give proof as a picture 📷')
        conversationPhase.set(chatId, 'proof')
      } else if(distance >= 1000) {
        await ctx.reply('Are you sure that right 👀? If it is, contact the admins')
      } else {
        await ctx.reply('Please give a positive number 👀')
      }
      break

    case 'proof':
      try {
        const fileId = ctx.message?.photo[3]?.file_id ?? ctx.message?.photo[2]?.file_id ?? ctx.message?.photo[1]?.file_id
        updateEntryStash(chatId, { fileId })
        entryToDb(chatId)
        await ctx.replyWithSticker(STICKERS[Math.floor(Math.random()*STICKERS.length)], commandsKeyboard)
        conversationPhase.delete(chatId)
      } catch (e) {
        console.log(e)
        await ctx.reply('That did not work 😔 Please try again')
      }
      break
  }

  return next()
}

export default message