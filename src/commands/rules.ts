import { RULES_TEXT } from "../common/constants.ts";
import type { ActionContext, CommandContext } from "../common/types.ts";
import { commandsKeyboard } from "../keyboards.ts";

const rules = async (
	ctx: CommandContext | ActionContext,
	next: () => Promise<void>,
) => {
	await ctx.replyWithHTML(RULES_TEXT, commandsKeyboard);
	return next();
};

export default rules;
