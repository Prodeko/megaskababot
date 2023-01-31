import { ActionContext } from "../../common/types"
import { conversationPhase } from "../../common/variables"
import { commandsKeyboard } from "../../keyboards"
import { userToDb } from "../../users"

export default async function login(ctx: ActionContext) {
  const userId = ctx!.from!.id
  const chatId = ctx!.chat!.id

  await ctx.editMessageReplyMarkup(undefined)
  await userToDb(userId)
  conversationPhase.delete(chatId)
  await ctx.reply('User data saved 💾!', commandsKeyboard)
}