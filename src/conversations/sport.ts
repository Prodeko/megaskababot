import { isSport } from "../common/validators.ts";
import {
  MegaskabaContext,
  MegaskabaConversation,
  Sport,
} from "../common/types.ts";
import {
  INVALID_SPORT_MESSAGE,
  SPORT_TYPE_MESSAGE,
} from "../common/constants.ts";
import { sportKeyboard } from "../keyboards.ts";

export async function sport(
  conversation: MegaskabaConversation,
  ctx: MegaskabaContext,
): Promise<Sport> {
  await ctx.reply(
    SPORT_TYPE_MESSAGE,
    { reply_markup: sportKeyboard },
  );

  let sport: Sport | null = null;

  while (!sport) {
    const sport_reply = (await conversation.waitFor("message:text"))
      .message
      .text
      .toLocaleLowerCase();

    if (isSport(sport_reply)) {
      sport = sport_reply;
    } else {
      await ctx.reply(INVALID_SPORT_MESSAGE);
    }
  }

  return sport;
}
