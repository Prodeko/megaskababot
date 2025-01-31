import { ChatTypeContext } from "grammy";
import { START_REGISTRATION_MESSAGE } from "../../common/constants.ts";
import { conversationPhase } from "../../common/variables.ts";
import { yearKeyboard } from "../../keyboards.ts";
import { updateUsersStash } from "../../users.ts";
import { MegaskabaContext } from "../../common/types.ts";

export default async function cancelLogin(
  ctx: ChatTypeContext<MegaskabaContext, "private">,
) {
  const chatId = ctx!.chat!.id;
  const userId = ctx!.from!.id;
  conversationPhase.set(chatId, "year");
  updateUsersStash(userId, {
    guild: undefined,
    freshmanYear: undefined,
  });

  await ctx.reply("Alright, lets try again");
  await ctx.reply(`Welcome to Megaskaba! ${START_REGISTRATION_MESSAGE}`);
  await ctx.reply("What is your freshman year?", {
    reply_markup: yearKeyboard,
  });
}
