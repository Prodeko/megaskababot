import {
  DISTANCE_MESSAGE,
  ENTER_NUMBER_IN_KILOMETERS_MESSAGE,
  MAX_ENTRY_DISTANCE_KM,
  POSITIVE_NUMBER_MESSAGE,
  SUSPICIOUS_DISTANCE_MESSAGE,
} from "../common/constants.ts";
import {
  MegaskabaContext,
  MegaskabaConversation,
  Sport,
} from "../common/types.ts";
import { randomInvalidInputSticker } from "../common/utils.ts";

export async function distance(
  conversation: MegaskabaConversation,
  ctx: MegaskabaContext,
  sport: Sport,
) {
  await ctx.reply(`${DISTANCE_MESSAGE} ${sport}?`);

  let validDistance: number | null = null;

  // Loop for getting validated distance
  while (validDistance === null) {
    let number: number | null = null;

    // Loop for getting a parseable
    while (number === null) {
      const potentialNumberResponse =
        (await conversation.waitFor("msg:text")).msg.text;

      const parsedNumber = Number.parseFloat(
        potentialNumberResponse.replace(",", "."),
      );

      if (!isNaN(parsedNumber)) {
        number = parsedNumber;
      } else {
        await ctx.reply(ENTER_NUMBER_IN_KILOMETERS_MESSAGE);
      }
    }

    // Validate parsed number as a sensible distance
    if (number <= 0) {
      await ctx.replyWithSticker(randomInvalidInputSticker());
      await ctx.reply(POSITIVE_NUMBER_MESSAGE);
    } else if (number <= MAX_ENTRY_DISTANCE_KM) {
      validDistance = number;
    } else {
      await ctx.replyWithSticker(randomInvalidInputSticker());
      await ctx.reply(SUSPICIOUS_DISTANCE_MESSAGE);
    }
  }

  return validDistance;
}
