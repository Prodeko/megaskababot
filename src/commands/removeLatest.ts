import type { ActionContext, CommandContext } from "../common/types.js.ts";
import { removeLatest } from "../entries.js.ts";
import { commandsKeyboard } from "../keyboards.js.ts";

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
