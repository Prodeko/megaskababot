import { CommandContext } from "../common/types";
import { conversationPhase } from "../common/variables";
import { transpKeyboard } from "../keyboards";

const entry = async (ctx: CommandContext) => {
  await ctx.reply('Welcome back! Did you ski or run/walk?', transpKeyboard)
  conversationPhase.set(ctx.chat.id, 'transp')
}

export default entry