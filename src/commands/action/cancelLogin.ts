import { START_REGISTRATION_MESSAGE } from "../../common/constants"
import { ActionContext } from "../../common/types"
import { conversationPhase } from "../../common/variables"
import { yearKeyboard } from "../../keyboards"
import { updateUsersStash } from "../../users"

export default async function cancelLogin(ctx: ActionContext,  next: () => Promise<void>) {
    const chatId = ctx!.chat!.id
    const userId = ctx!.from!.id
    conversationPhase.set(chatId, 'year')
    updateUsersStash(userId, {
      guild: undefined,
      freshmanYear: undefined
    })
 
    await ctx.reply("Alright, lets try again")
    await ctx.reply(
      `Welcome to MEGASCIBA! ${START_REGISTRATION_MESSAGE}`
    )
    await ctx.reply('What is your freshman year?', yearKeyboard)
    return next()
}