import { CommandContext, Context } from "grammy";
import { removeLatest } from "../entries.ts";
import { commandsKeyboard } from "../keyboards.ts";

const removeLatestCommand = async (
  ctx: CommandContext<Context>,
) => {
  const result = await removeLatest(ctx!.from!.id);
  if (result) {
    await ctx.reply("Removed latest entry!", {
      reply_markup: commandsKeyboard,
    });
  } else {
    await ctx.reply("No entries to remove", { reply_markup: commandsKeyboard });
  }
};

export default removeLatestCommand;
