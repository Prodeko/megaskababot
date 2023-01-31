import _ from "lodash"
import { INVALID_INPUT_STICKERS } from "../../common/constants"
import { TextCtxType } from "../../common/types"
import { randomInvalidInputSticker } from "../../common/utils"
import { conversationPhase } from "../../common/variables"
import { updateEntryStash } from "../../entries"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function distance(ctx: TextCtxType, distStr: string, chatId: number, userId: number) {
  if(!distStr) return await ctx.reply("Please input text 👀")

  const distance = parseFloat(distStr.replace(",", "."))
  if (!isNaN(distance) && distance > 0 && distance < 1000) {
    updateEntryStash(chatId, {
      userId,
      distance,
    })
    await ctx.reply('Please give proof as a picture 📷')
    conversationPhase.set(chatId, 'proof')
  } else if(distance >= 1000) {
    await ctx.replyWithSticker(randomInvalidInputSticker())
  } else {
    await ctx.replyWithSticker(randomInvalidInputSticker())
    await ctx.reply('Please give a positive number 👀')
  }
}