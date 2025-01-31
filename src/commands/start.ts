import { ChatTypeContext, CommandContext } from "grammy";
import { isBigInteger } from "../common/validators.ts";
import { commandsKeyboard } from "../keyboards.ts";
import { MegaskabaContext } from "../common/types.ts";
import { prisma } from "../../prisma/client.ts";

const start = async (
  ctx: CommandContext<ChatTypeContext<MegaskabaContext, "private">>,
  next: () => Promise<void>,
) => {
  const userId = ctx.chatId;

  if (!isBigInteger(userId)) {
    throw TypeError("Invalid user ID received from ctx");
  }

  const privacyState = await prisma.privacyAccepted.findUnique({
    where: { telegramUserId: userId },
    select: { accepted: true, telegramUserId: true, user: true },
  });

  if (!privacyState?.accepted) {
    await ctx.conversation.reenter("privacy");
    return;
  }

  if (privacyState.user == null) {
    // No user found but privacy policy is accepted
    await ctx.conversation.reenter("register");
  } else {
    // Privacy policy accepted and user is already registered.
    await ctx.reply(
      "Welcome back to Megaskaba! What would you like to do?",
      { reply_markup: commandsKeyboard },
    );
  }

  return next();
};

export default start;
