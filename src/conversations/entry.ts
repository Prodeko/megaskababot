import { ChatTypeContext } from "grammy";
import {
  ENTRY_ADDED_MESSAGE,
  NOT_REGISTERED_MESSAGE,
  SORRY_ARCHIVE_ENABLED_MESSAGE,
  STICKERS,
} from "../common/constants.ts";
import { MegaskabaContext, MegaskabaConversation } from "../common/types.ts";
import { saveEntry } from "../entries.ts";
import { checkIfUserHasRegistered } from "../users.ts";
import { image } from "./image.ts";
import { sport } from "./sport.ts";
import { commandsKeyboard } from "../keyboards.ts";
import { distance } from "./distance.ts";
import { prisma } from "../../prisma/client.ts";
// @ts-types="generated/index.d.ts"
import { Setting } from "generated/index.js";

export async function entry(
  conversation: MegaskabaConversation,
  ctx: ChatTypeContext<MegaskabaContext, "private">,
) {
  const userId = ctx.chatId;

  if (!(await checkIfUserHasRegistered(userId))) {
    return await ctx.reply(NOT_REGISTERED_MESSAGE);
  }

  const isArchive = (await prisma.applicationSettings.findFirst({
    where: { setting: Setting.ARCHIVE_MODE },
  }))?.value == "true";

  if (isArchive) {
    await ctx.reply(SORRY_ARCHIVE_ENABLED_MESSAGE, {
      reply_markup: commandsKeyboard,
    });
    return;
  }

  const enteredSport = await sport(conversation, ctx);
  const enteredDistance = await distance(conversation, ctx, enteredSport);
  const enteredImage = await image(conversation, ctx);

  await conversation.external(() =>
    saveEntry({
      distance: enteredDistance,
      sport: enteredSport,
      doublePoints: false,
      fileIds: enteredImage,
      userId: ctx.chatId,
    })
  );

  await ctx.replyWithSticker(
    STICKERS[Math.floor(Math.random() * STICKERS.length)],
  );

  await ctx.reply(ENTRY_ADDED_MESSAGE, { reply_markup: commandsKeyboard });
}
