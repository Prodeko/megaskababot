import type { ActionContext, CommandContext } from "../common/types.js.ts";
import { conversationPhase } from "../common/variables.js.ts";
import { sportKeyboard } from "../keyboards.js.ts";
import { isUser } from "../users.js.ts";

const entry = async (
  ctx: CommandContext | ActionContext,
  next: () => Promise<void>,
) => {
  if (!(await isUser(ctx!.from!.id))) {
    return await ctx.reply("Not an user yet! Use /start to make an user");
  }
  await ctx.reply(
    "Welcome back! How did you cover ground today?",
    sportKeyboard,
  );

  conversationPhase.set(ctx!.chat!.id, "sport");
  return next();
};

export default entry;
