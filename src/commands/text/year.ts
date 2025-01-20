import { ChatTypeContext } from "grammy";
import { YEARS } from "../../common/constants.ts";
import { conversationPhase } from "../../common/variables.ts";
import { guildKeyboard } from "../../keyboards.ts";
import { updateUsersStash } from "../../users.ts";
import { MegaskabaContext } from "../../common/types.ts";

export default async function year(
  ctx: ChatTypeContext<MegaskabaContext, "private">,
  yearStr: string,
  userId: number,
  chatId: number,
) {
  const asNum = Number.parseInt(yearStr);
  if (!YEARS.includes(yearStr)) {
    return await ctx.reply("Please give a number between 1950 - 2023 👀");
  }

  updateUsersStash(userId, { freshmanYear: asNum });
  conversationPhase.set(chatId, "guild");
}
