import type { ActionContext, CommandContext } from "../common/types.ts";
import { removeLatest } from "../entries.ts";
import { commandsKeyboard } from "../keyboards.ts";

const removeLatestCommand = async (
	ctx: CommandContext | ActionContext,
	next: () => Promise<void>,
) => {
	const result = await removeLatest(ctx!.from!.id);
	if (result) {
		await ctx.reply("Removed latest entry!", commandsKeyboard);
	} else {
		await ctx.reply("No entries to remove", commandsKeyboard);
	}
	return next();
};

export default removeLatestCommand;
