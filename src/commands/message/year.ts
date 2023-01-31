import { YEARS } from "../../common/constants"
import { conversationPhase } from "../../common/variables"
import { guildKeyboard } from "../../keyboards"
import { updateUsersStash } from "../../users"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function year(ctx:any, yearStr: string, userId: number, chatId: number) {
  const asNum = parseFloat(yearStr)
  if (!YEARS.includes(yearStr)) {
    await ctx.reply('Please give a number beatween 1950 - 2023 👀')
  }

  updateUsersStash(userId, { freshmanYear: asNum })
  await ctx.reply('From which guild are you?', guildKeyboard)
  conversationPhase.set(chatId, 'guild')
  
}