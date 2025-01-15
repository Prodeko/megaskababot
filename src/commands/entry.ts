import { CommandContext, Context } from "grammy";
import { conversationPhase } from "../common/variables.ts";
import { sportKeyboard } from "../keyboards.ts";
import { isUser } from "../users.ts";

const entry = async (
  ctx: CommandContext<Context>,
) => {
  if (!(await isUser(ctx!.from!.id))) {
    return await ctx.reply("Not an user yet! Use /start to make an user");
  }
  await ctx.reply(
    "Welcome back! How did you cover ground today?",
    { reply_markup: sportKeyboard },
  );

  conversationPhase.set(ctx!.chat!.id, "sport");
};

export default entry;
