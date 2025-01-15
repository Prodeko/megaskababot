/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  PRIVACY_REJECTED_MESSAGE,
  START_REGISTRATION_MESSAGE,
} from "../../common/constants.ts";
import type { ActionContext } from "../../common/types.ts";
import { isBigInteger } from "../../common/validators.ts";
import { conversationPhase } from "../../common/variables.ts";
import { yearKeyboard } from "../../keyboards.ts";
import { updateUsersStash } from "../../users.ts";

export async function onPrivacyAccepted(
  ctx: ActionContext,
  next: () => Promise<void>,
) {
  conversationPhase.set(ctx.chat!.id, "year");

  const telegramUserId = ctx!.from!.id;

  if (!isBigInteger(telegramUserId)) {
    throw TypeError("Invalid user ID received from ctx");
  }

  updateUsersStash(ctx!.from!.id, {
    firstName: ctx!.from!.first_name,
    lastName: ctx!.from!.last_name,
    telegramUsername: ctx!.from!.username,
    telegramUserId,
  });
  await ctx.reply(START_REGISTRATION_MESSAGE);
  await ctx.reply("What is your freshman year?", yearKeyboard);
  return next();
}

export async function onPrivacyRejected(
  ctx: ActionContext,
  next: () => Promise<void>,
) {
  await ctx.reply(PRIVACY_REJECTED_MESSAGE);
  return next();
}
