import type { ActionContext, CommandContext } from "../common/types";
import { conversationPhase } from "../common/variables";
import { sportKeyboard } from "../keyboards";
import { isUser } from "../users";

const entry = async (
	ctx: CommandContext | ActionContext,
	next: () => Promise<void>,
) => {
	if (!(await isUser(ctx!.from!.id)))
		return await ctx.reply("Not an user yet! Use /start to make an user");
	await ctx.reply(
		"Welcome back! How did you cover ground today?",
		sportKeyboard,
	);

	conversationPhase.set(ctx!.chat!.id, "sport");
	return next();
};

export default entry;
