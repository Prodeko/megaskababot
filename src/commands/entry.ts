import { CommandContext } from "../common/types";
import { conversationPhase } from "../common/variables";
import { transpKeyboard } from "../keyboards";
import { isUser } from "../users";
import start from "./start";

const entry = async (ctx: CommandContext) => {
  if(!isUser(ctx.from.id)) {
    return await start(ctx)
  }
  await ctx.reply('Welcome back! Did you ski ⛷️, run/walk 🏃‍♀️ or skate ⛸️?', transpKeyboard)
  conversationPhase.set(ctx.chat.id, 'transp')
}

export default entry