import { INTRODUCTORY_MESSAGE, START_REGISTRATION_MESSAGE, PRIVACY_POLICY } from "../common/constants"
import { CommandContext } from "../common/types"
import { conversationPhase } from "../common/variables"
import { inlinePrivacyKeyboard, transpKeyboard, yearKeyboard } from "../keyboards"
import { isUser, updateUsersStash } from "../users"
import entry from "./entry"


const start = async (ctx: CommandContext) => {
  const userId = ctx.message.from.id

  // Assuming that all users that have their data in the database have accepted the privacy policy.
  const userExistsInDatabase = await isUser(userId)
  const isNewChat = !conversationPhase.has(ctx.chat.id) && !userExistsInDatabase

  if (isNewChat) {
    await ctx.reply(INTRODUCTORY_MESSAGE)
    await ctx.reply(PRIVACY_POLICY, inlinePrivacyKeyboard)
    return
  }

  if (!userExistsInDatabase) {
    conversationPhase.set(ctx.chat.id, 'year')
    updateUsersStash(userId, {
      firstName: ctx.message.from.first_name,
      lastName: ctx.message.from.last_name,
      telegramUsername: ctx.message.from.username,
      telegramUserId: ctx.message.from.id,
    })
    ctx.reply(
      `Welcome to megaskaba! ${START_REGISTRATION_MESSAGE}`
    )
    ctx.reply('What is your freshman year?', yearKeyboard)
  } else {
    await entry(ctx)
  }
}

export default start