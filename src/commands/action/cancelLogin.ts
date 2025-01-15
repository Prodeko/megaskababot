import { START_REGISTRATION_MESSAGE } from "../../common/constants.js.ts";
import type { ActionContext } from "../../common/types.js.ts";
import { conversationPhase } from "../../common/variables.js.ts";
import { yearKeyboard } from "../../keyboards.js.ts";
import { updateUsersStash } from "../../users.js.ts";

export default async function cancelLogin(
  ctx: ActionContext,
  next: () => Promise<void>,
) {
  const chatId = ctx!.chat!.id;
  const userId = ctx!.from!.id;
  conversationPhase.set(chatId, "year");
  updateUsersStash(userId, {
    guild: undefined,
    freshmanYear: undefined,
  });

  await ctx.reply("Alright, lets try again");
  await ctx.reply(`Welcome to GIGASKABA! ${START_REGISTRATION_MESSAGE}`);
  await ctx.reply("What is your freshman year?", yearKeyboard);
  return next();
}
