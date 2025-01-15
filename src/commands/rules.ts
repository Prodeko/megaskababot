import { RULES_TEXT } from "../common/constants.js.ts";
import type { ActionContext, CommandContext } from "../common/types.js.ts";
import { commandsKeyboard } from "../keyboards.js.ts";

const rules = async (
  ctx: CommandContext | ActionContext,
  next: () => Promise<void>,
) => {
  await ctx.replyWithHTML(RULES_TEXT, commandsKeyboard);
  return next();
};

export default rules;
