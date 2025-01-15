import { RULES_TEXT } from "../common/constants";
import type { ActionContext, CommandContext } from "../common/types";
import { commandsKeyboard } from "../keyboards";

const rules = async (
  ctx: CommandContext | ActionContext,
  next: () => Promise<void>,
) => {
  await ctx.replyWithHTML(RULES_TEXT, commandsKeyboard);
  return next();
};

export default rules;
