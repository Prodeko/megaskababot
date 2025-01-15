import { YEARS } from "../../common/constants.js.ts";
import type { TextCtxType } from "../../common/types.js.ts";
import { conversationPhase } from "../../common/variables.js.ts";
import { guildKeyboard } from "../../keyboards.js.ts";
import { updateUsersStash } from "../../users.js.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function year(
  ctx: TextCtxType,
  yearStr: string,
  userId: number,
  chatId: number,
) {
  const asNum = Number.parseInt(yearStr);
  if (!YEARS.includes(yearStr)) {
    return await ctx.reply("Please give a number between 1950 - 2023 👀");
  }

  updateUsersStash(userId, { freshmanYear: asNum });
  await ctx.reply("From which guild are you?", guildKeyboard);
  conversationPhase.set(chatId, "guild");
}
