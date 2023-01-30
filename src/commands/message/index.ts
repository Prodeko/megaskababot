import { STICKERS } from '../../common/constants'
import { isGuild, isSport } from '../../common/validators'
import { conversationPhase } from '../../common/variables'
import { entryToDb, updateEntryStash } from '../../entries'
import { guildKeyboard, transpKeyboard } from '../../keyboards'
import { updateUsersStash, userToDb } from '../../users'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const message = async (ctx: any, next: () => Promise<void>) => {
  const chatId = ctx.chat?.id
  const text = ctx.update.message?.text
  const userId = ctx.update.message.from.id

  switch (conversationPhase.get(chatId)) {
    case 'year':
      const asNum = parseFloat(text)
      if (isNaN(asNum)) {
        ctx.reply('That is not a number 🤔')
      }

      updateUsersStash(userId, { freshmanYear: asNum })
      ctx.reply('From which guild are you?', guildKeyboard)
      conversationPhase.set(chatId, 'guild')
      break

    case 'guild':
      if (isGuild(text)) {
        updateUsersStash(userId, { guild: text })
        userToDb(userId)
        ctx.reply('Your user data has now been saved! Did you ski ⛷️ or run/walk 🏃‍♀️?', transpKeyboard)
        conversationPhase.set(chatId, 'transp')
      } else {
        ctx.reply('Please give a proper guild')
      }
      break

    case 'transp':
      if (isSport(text)) {
        updateEntryStash(chatId, { sport: text })
        ctx.reply(`What distance (km) did you ${text}?`)
        conversationPhase.set(chatId, 'dist')
      } else {
        ctx.reply('Please give a proper transportation method')
      }
      break

    case 'dist':
      const distance = parseFloat(text.replace(",", "."))
      if (!isNaN(distance) && distance > 0) {
        updateEntryStash(chatId, {
          userId,
          distance,
        })
        ctx.reply('Please give proof as a picture 📷')
        conversationPhase.set(chatId, 'proof')
      } else {
        ctx.reply('Please give a positive number 👀')
      }
      break

    case 'proof':
      try {
        const fileId = ctx.message?.photo[3].file_id
        updateEntryStash(chatId, { fileId })
        entryToDb(chatId)
        await ctx.replyWithSticker(STICKERS[Math.floor(Math.random()*STICKERS.length)])
        conversationPhase.delete(chatId)
      } catch {
        ctx.reply('That did not work 😔 Please try again')
      }
      break
  }

  return next()
}

export default message