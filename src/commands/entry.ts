import { ActionContext, CommandContext } from "../common/types";
import { conversationPhase } from "../common/variables";
import { sportKeyboard } from "../keyboards";
import { isUser } from "../users";

const entry = async (ctx: CommandContext | ActionContext) => {
  if(!(await isUser(ctx!.from!.id))) return await ctx.reply("Not an user yet! Use /start to make an user")
  await ctx.reply('Welcome back! Did you ski ⛷️, run/walk 🏃‍♀️ or skate ⛸️?', sportKeyboard)
  try {
    await ctx.editMessageReplyMarkup(undefined)
  } catch (e) {
    console.log(e)
  }finally {
    conversationPhase.set(ctx!.chat!.id, 'sport')
  }
}

export default entry