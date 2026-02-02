import {
  CONFIRM_REGISTERATION_MESSAGE,
  ENTER_FRESHMAN_YEAR_MESSAGE,
  ENTER_GUILD_MESSAGE,
  FRESHMAN_YEAR_MESSAGE,
  GUILD_MESSAGE,
  LETS_TRY_AGAIN_MESSAGE,
  REGISTRATION_SUCCESSFUL_MESSAGE,
  UNEXPECTED_GUILD_MESSAGE,
} from "../common/constants.ts";
import {
  ConversationContext,
  Guild,
  MegaskabaConversation,
} from "../common/types.ts";
import {
  commandsKeyboard,
  guildKeyboard,
  loginConfiramtionKeyboard,
  yearKeyboard,
} from "../keyboards.ts";
import { isGuild } from "../common/validators.ts";
import { prisma } from "../../prisma/client.ts";
import { UserWithoutTime } from "../common/types.ts";
import { capitalizeFirstLetter } from "../common/utils.ts";
import { year } from "./year.ts";

export async function register(
  conversation: MegaskabaConversation,
  ctx: ConversationContext,
) {
  let user: UserWithoutTime | null = null;

  while (!user) {
    const freshmanYear = await year(conversation, ctx);

    await ctx.reply(ENTER_GUILD_MESSAGE, {
      reply_markup: guildKeyboard,
    });

    let guild: Guild | null = null;

    while (!guild) {
      const possiblyGuildString =
        (await conversation.waitFor("message")).message.text;

      const lowerCasePossiblyGuildString = possiblyGuildString
        ?.toLocaleLowerCase();

      if (isGuild(lowerCasePossiblyGuildString)) {
        guild = lowerCasePossiblyGuildString;
      } else {
        await ctx.reply(UNEXPECTED_GUILD_MESSAGE);
      }
    }

    await ctx.reply(
      `
    ${CONFIRM_REGISTERATION_MESSAGE}

      ${GUILD_MESSAGE}: ${capitalizeFirstLetter(guild)}
      ${FRESHMAN_YEAR_MESSAGE}: ${freshmanYear}
    `,
      { reply_markup: loginConfiramtionKeyboard },
    );

    const callbackResponse = await conversation.waitForCallbackQuery([
      "register",
      "cancel_register",
    ]);
    const removeInlineKeyboardPromise = callbackResponse
      .editMessageReplyMarkup();
    const accepted = callbackResponse.match === "register";

    if (accepted) {
      user = {
        firstName: ctx.chat.first_name,
        lastName: ctx.chat.last_name,
        telegramUsername: ctx.chat.username,
        telegramUserId: ctx.chatId as unknown as bigint,
        guild,
        freshmanYear,
      };
    } else {
      const retryMessage = ctx.reply(
        `${LETS_TRY_AGAIN_MESSAGE}. ${ENTER_FRESHMAN_YEAR_MESSAGE}`,
        {
          reply_markup: yearKeyboard,
        },
      );
      await Promise.all([removeInlineKeyboardPromise, retryMessage]);
    }
  }

  await conversation.external(() =>
    prisma.user.create({
      data: user,
    })
  );

  await ctx.reply(
    `${REGISTRATION_SUCCESSFUL_MESSAGE}, ${
      capitalizeFirstLetter(user.firstName)
    }!`,
    { reply_markup: commandsKeyboard },
  );
}
