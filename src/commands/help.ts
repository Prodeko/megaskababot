import { CommandContext } from "../common/types"

const help = (ctx: CommandContext) => {
  ctx.reply(
    'Type /start to log in or add a new entry\n\nType /entries to get a list of your entries'
  )
}

export default help