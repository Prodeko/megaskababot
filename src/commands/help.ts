import { HELP_TEXT } from "../common/constants"
import { CommandContext } from "../common/types"

const help = (ctx: CommandContext) => {
  ctx.replyWithHTML(HELP_TEXT)
}

export default help