import { prisma } from "../../prisma/client.ts";
import {
  INTRODUCTORY_MESSAGE,
  PRIVACY_POLICY,
  PRIVACY_REJECTED_MESSAGE,
  PRIVACY_RETRY_MESSAGE,
} from "../common/constants.ts";
import { ConversationContext, MegaskabaConversation } from "../common/types.ts";
import { inlinePrivacyKeyboard } from "../keyboards.ts";
import { register } from "./register.ts";

async function respondToPrivacyInlineButtonPress(
  conversation: MegaskabaConversation,
  ctx: ConversationContext,
): Promise<boolean> {
  const response = await conversation.waitForCallbackQuery([
    "accepted",
    "rejected",
  ], {});
  const removeInlineButtonsPromise = response.editMessageReplyMarkup();

  const accepted = response.match === "accepted";
  const telegramUserId = ctx.chatId;

  const upsertPromise = conversation.external(() =>
    prisma.privacyAccepted.upsert({
      where: { telegramUserId },
      update: {
        accepted,
      },
      create: {
        telegramUserId,
        accepted,
      },
    })
  );

  await Promise.all([removeInlineButtonsPromise, upsertPromise]);

  return accepted;
}

export async function privacy(
  conversation: MegaskabaConversation,
  ctx: ConversationContext,
) {
  await ctx.reply(INTRODUCTORY_MESSAGE);
  await ctx.reply(PRIVACY_POLICY, {
    reply_markup: inlinePrivacyKeyboard,
  });

  let accepted = await respondToPrivacyInlineButtonPress(conversation, ctx);

  if (accepted) {
    await register(conversation, ctx);
    return;
  }

  // Ask again
  await ctx.reply(PRIVACY_RETRY_MESSAGE, {
    reply_markup: inlinePrivacyKeyboard,
  });

  accepted = await respondToPrivacyInlineButtonPress(conversation, ctx);

  if (accepted) {
    await register(conversation, ctx);
    return;
  } else {
    // Give up on asking and prompt user to restart if rejected again
    await ctx.reply(PRIVACY_REJECTED_MESSAGE);
  }
}
