import _ from 'lodash'

import { isGuild } from '../../common/validators'
import { conversationPhase } from '../../common/variables'
import { commandsKeyboard } from '../../keyboards'
import { updateUsersStash, userToDb } from '../../users'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function guild(ctx: any, guildStr: string, userId: number, chatId: number) {
  const guild = _.lowerCase(guildStr)
  if (isGuild(guild)) {
    updateUsersStash(userId, { guild })
    await userToDb(userId)
    conversationPhase.delete(chatId)
    await ctx.reply('User data saved 💾!', commandsKeyboard)
  } else {
    await ctx.reply('Please give a proper guild')
  }
}
