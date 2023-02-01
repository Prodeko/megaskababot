import { TextCtxType } from "../../common/types"
import { randomInvalidInputSticker } from "../../common/utils"
import { conversationPhase } from "../../common/variables"
import { updateEntryStash } from "../../entries"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function distance(ctx: TextCtxType, distStr: string, chatId: number, userId: number) {
  if(!distStr) return await ctx.reply("Please input text 👀")

  const distance = parseFloat(distStr.replace(",", "."))
  if (!isNaN(distance) && distance > 0 && distance < 300) {
    updateEntryStash(chatId, {
      userId,
      distance,
    })
    await ctx.reply('Please give proof as a picture 📷')
    conversationPhase.set(chatId, 'proof')
  } else if(distance >= 1000) {
    await ctx.replyWithSticker(randomInvalidInputSticker())
    await ctx.reply('Please give the distance in kilometers 👀. If you really did over 300km in one go, contact the admins')
  } else {
    await ctx.replyWithSticker(randomInvalidInputSticker())
    await ctx.reply('Please give a positive number 👀')
  }
}