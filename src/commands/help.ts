import { HELP_TEXT } from "../common/constants";
import type { ActionContext, CommandContext } from "../common/types";
import { commandsKeyboard } from "../keyboards";

const help = async (
  ctx: CommandContext | ActionContext,
  next: () => Promise<void>,
) => {
  await ctx.replyWithHTML(HELP_TEXT, commandsKeyboard);
  return next();
};

export default help;
