import { TextCtxType } from "../../common/types"
import { isSport } from "../../common/validators"
import { conversationPhase } from "../../common/variables"
import { updateEntryStash } from "../../entries"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function sport(ctx: TextCtxType, text: string, chatId: number) {
  if (isSport(text)) {
    updateEntryStash(chatId, { sport: text })
    await ctx.reply(`What distance (km) did you ${text}?`)
    conversationPhase.set(chatId, 'dist')
  } else {
    await ctx.reply('Please give a proper sport')
  }
}
