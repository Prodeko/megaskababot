import { COEFFICIENTS } from "../common/constants"
import { CommandContext } from "../common/types"
import { formatEntry } from "../common/utils"
import { getEntries } from "../entries"

const entries = async (ctx: CommandContext) => {
  const entries = await getEntries(ctx.message.from.id)
  if (entries.length > 0) {
    const points = entries
      .map(e => e.distance * COEFFICIENTS[e.sport])
      .reduce((p, e) => p + e, 0)
    ctx.reply(
      entries
        .map(formatEntry)
        .concat([`Total points: ${points}`])
        .join('\n\n')
    )
  } else {
    ctx.reply('No entries yet!')
  }
}

export default entries