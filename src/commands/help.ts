import { HELP_TEXT } from "../common/constants.ts";
import { commandsKeyboard } from "../keyboards.ts";
import {
  PrivateCallbackMegaskabaContext,
  PrivateCommandMegaskabaContext,
} from "../common/types.ts";

const help = async (
  ctx: PrivateCallbackMegaskabaContext | PrivateCommandMegaskabaContext,
) => {
  await ctx.reply(HELP_TEXT, {
    parse_mode: "HTML",
    reply_markup: commandsKeyboard,
  });
};

export default help;
