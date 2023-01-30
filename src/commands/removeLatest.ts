import { ActionContext, CommandContext } from "../common/types"
import { removeLatest } from "../entries"
import { commandsKeyboard } from "../keyboards"

const removeLatestCommand = async (ctx: CommandContext | ActionContext) => {
  const result = await removeLatest(ctx!.from!.id)
  try {
    await ctx.editMessageReplyMarkup(undefined)
  } catch {}
  if (result) {
    ctx.reply('Removed latest entry!', commandsKeyboard)
  } else {
    ctx.reply('No entries to remove', commandsKeyboard)
  }
}

export default removeLatestCommand