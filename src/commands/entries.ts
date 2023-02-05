import _ from 'lodash'

import { COEFFICIENTS } from '../common/constants'
import { ActionContext, CommandContext } from '../common/types'
import { formatEntry } from '../common/utils'
import { getEntries } from '../entries'
import { commandsKeyboard } from '../keyboards'

const entries = async (ctx: CommandContext | ActionContext) => {
  const entries = await getEntries(ctx!.from!.id)
  try {
    await ctx.editMessageReplyMarkup(undefined)
  } catch {}
  if (entries.length > 0) {
    const points = entries.map(e => e.distance * COEFFICIENTS[e.sport]).reduce((p, e) => p + e, 0)

    const distance = entries.reduce((p, e) => p + e.distance, 0)

    const distanceBySport = Object.entries((_.groupBy(entries, e => e.sport)))
      .map<[string, number]>(([key, value]) => [key, value.reduce((p, e) => p + e.distance, 0)])

    await ctx.replyWithHTML(
      entries
        .map(formatEntry)
        .concat(["<strong>Totals</strong>"].concat(distanceBySport.map(([sport, dist]) => `${sport}: ${dist} km`)).join("\n"))
        .concat([
          `Total distance: ${distance.toFixed(2)} km\nTotal points: ${points.toFixed(2)} points`,
        ])
        .join('\n\n'),
      commandsKeyboard
    )
  } else {
    await ctx.reply('No entries yet!', commandsKeyboard)
  }
}

export default entries
