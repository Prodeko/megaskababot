import { CommandContext } from "../common/types"
import { removeLatest } from "../entries"

const removeLatestCommand = async (ctx: CommandContext) => {
  const result = await removeLatest(ctx.from.id)
  if (result) {
    ctx.reply('Removed latest entry!')
  } else {
    ctx.reply('No entries to remove')
  }
}

export default removeLatestCommand