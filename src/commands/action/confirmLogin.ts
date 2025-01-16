import { ChatTypeContext } from "grammy";
import { conversationPhase } from "../../common/variables.ts";
import { commandsKeyboard } from "../../keyboards.ts";
import { userToDb } from "../../users.ts";
import { MegaskabaContext } from "../../common/types.ts";

export default async function login(
  ctx: ChatTypeContext<MegaskabaContext, "private">,
) {
  const userId = ctx!.from!.id;
  const chatId = ctx!.chat!.id;

  await userToDb(userId);
  conversationPhase.delete(chatId);
  await ctx.reply("User data saved 💾!", { reply_markup: commandsKeyboard });
}
