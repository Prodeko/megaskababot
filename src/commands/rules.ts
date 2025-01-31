import { RULES_TEXT } from "../common/constants.ts";
import { commandsKeyboard } from "../keyboards.ts";
import {
  PrivateCallbackMegaskabaContext,
  PrivateCommandMegaskabaContext,
} from "../common/types.ts";

const rules = async (
  ctx: PrivateCommandMegaskabaContext | PrivateCallbackMegaskabaContext,
) => {
  await ctx.reply(RULES_TEXT, {
    parse_mode: "HTML",
    reply_markup: commandsKeyboard,
  });
};

export default rules;
