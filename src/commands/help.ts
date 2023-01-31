import { HELP_TEXT } from '../common/constants'
import { ActionContext, CommandContext } from '../common/types'
import { commandsKeyboard } from '../keyboards'

const help = async (ctx: CommandContext | ActionContext) => {
  try {
    await ctx.editMessageReplyMarkup(undefined)
  } catch {}
  await ctx.replyWithHTML(HELP_TEXT, commandsKeyboard)
}

export default help
