import { CommandContext, Context } from "grammy";
import { HELP_TEXT } from "../common/constants.ts";
import { commandsKeyboard } from "../keyboards.ts";

const help = async (
  ctx: CommandContext<Context>,
) => {
  await ctx.reply(HELP_TEXT, {
    parse_mode: "HTML",
    reply_markup: commandsKeyboard,
  });
};

export default help;
