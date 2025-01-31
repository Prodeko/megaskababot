import {
  CURRENT_YEAR,
  ENTER_FRESHMAN_YEAR_MESSAGE,
  FIRST_FRESHMAN_YEAR,
  PLEASE_ENTER_YEAR_MESSAGE,
  START_REGISTRATION_MESSAGE,
} from "../common/constants.ts";
import { MegaskabaContext, MegaskabaConversation } from "../common/types.ts";
import { randomInvalidInputSticker } from "../common/utils.ts";
import { yearKeyboard } from "../keyboards.ts";

export async function year(
  conversation: MegaskabaConversation,
  ctx: MegaskabaContext,
) {
  await ctx.reply(
    `
${START_REGISTRATION_MESSAGE}.
    
${ENTER_FRESHMAN_YEAR_MESSAGE}
    `,
    {
      reply_markup: yearKeyboard,
    },
  );

  let validDistance: number | null = null;

  // Loop for getting validated distance
  while (validDistance === null) {
    let number: number | null = null;

    // Loop for getting a parseable
    while (number === null) {
      const potentialNumberResponse =
        (await conversation.waitFor("msg:text")).msg.text;

      const parsedNumber = Number.parseInt(potentialNumberResponse);

      if (!isNaN(parsedNumber)) {
        number = parsedNumber;
      } else {
        await ctx.reply(PLEASE_ENTER_YEAR_MESSAGE);
      }
    }

    // Validate parsed number as a sensible freshman year
    if (number < FIRST_FRESHMAN_YEAR || number > CURRENT_YEAR) {
      await ctx.replyWithSticker(randomInvalidInputSticker());
      await ctx.reply(PLEASE_ENTER_YEAR_MESSAGE);
    } else {
      validDistance = number;
    }
  }

  return validDistance;
}
