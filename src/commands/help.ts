import { HELP_TEXT } from "../common/constants.js.ts";
import type { ActionContext, CommandContext } from "../common/types.js.ts";
import { commandsKeyboard } from "../keyboards.js.ts";

const help = async (
  ctx: CommandContext | ActionContext,
  next: () => Promise<void>,
) => {
  await ctx.replyWithHTML(HELP_TEXT, commandsKeyboard);
  return next();
};

export default help;
