import { ActionContext, CommandContext } from "../common/types";
import { conversationPhase } from "../common/variables";
import { transpKeyboard } from "../keyboards";
import { isUser } from "../users";

const entry = async (ctx: CommandContext | ActionContext) => {
  if(!isUser(ctx!.from!.id)) return ctx.reply("Not an user yet!")
  await ctx.reply('Welcome back! Did you ski ⛷️, run/walk 🏃‍♀️ or skate ⛸️?', transpKeyboard)
  try {
    await ctx.editMessageReplyMarkup(undefined)
  } finally {
    conversationPhase.set(ctx!.chat!.id, 'transp')
  }
}

export default entry