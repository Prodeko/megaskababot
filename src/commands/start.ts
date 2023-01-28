import { CommandContext } from "../common/types"
import { conversationPhase } from "../common/variables"
import { transpKeyboard, yearKeyboard } from "../keyboards"
import { isUser, updateUsersStash } from "../users"

const start = async (ctx: CommandContext) => {
  const userId = ctx.message.from.id
  if (!(await isUser(userId))) {
    conversationPhase.set(ctx.chat.id, 'year')
    updateUsersStash(userId, {
      firstName: ctx.message.from.first_name,
      lastName: ctx.message.from.last_name,
      telegramUsername: ctx.message.from.username,
      telegramUserId: ctx.message.from.id,
    })
    ctx.reply(
      "Welcome to megaskaba! You have not registered previously, so I'll ask a few questions first"
    )
    ctx.reply('What is your freshman year?', yearKeyboard)
  } else {
    await ctx.reply('Welcome back! Did you ski or run/walk?', transpKeyboard)
    conversationPhase.set(ctx.chat.id, 'transp')
  }
}

export default start