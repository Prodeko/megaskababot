import { HELP_TEXT } from "../common/constants"
import { ActionContext, CommandContext } from "../common/types"
import { commandsKeyboard } from "../keyboards"

const help = async (ctx: CommandContext | ActionContext) => {
    await ctx.editMessageReplyMarkup(undefined)
    ctx.replyWithHTML(HELP_TEXT, commandsKeyboard)
}

export default help