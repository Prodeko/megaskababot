import { HELP_TEXT } from "../common/constants.ts";
import type { ActionContext, CommandContext } from "../common/types.ts";
import { commandsKeyboard } from "../keyboards.ts";

const help = async (
  ctx: CommandContext | ActionContext,
  next: () => Promise<void>,
) => {
  await ctx.replyWithHTML(HELP_TEXT, commandsKeyboard);
  return next();
};

export default help;
