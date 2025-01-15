import { CommandContext, Context } from "grammy";
import { RULES_TEXT } from "../common/constants.ts";
import { commandsKeyboard } from "../keyboards.ts";

const rules = async (
  ctx: CommandContext<Context>,
) => {
  await ctx.reply(RULES_TEXT, {
    parse_mode: "HTML",
    reply_markup: commandsKeyboard,
  });
};

export default rules;
