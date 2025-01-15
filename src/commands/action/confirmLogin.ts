import type { ActionContext } from "../../common/types.js.ts";
import { conversationPhase } from "../../common/variables.js.ts";
import { commandsKeyboard } from "../../keyboards.js.ts";
import { userToDb } from "../../users.js.ts";

export default async function login(
  ctx: ActionContext,
  next: () => Promise<void>,
) {
  const userId = ctx!.from!.id;
  const chatId = ctx!.chat!.id;

  await userToDb(userId);
  conversationPhase.delete(chatId);
  await ctx.reply("User data saved 💾!", commandsKeyboard);
  return next();
}
