/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { START_REGISTRATION_MESSAGE, PRIVACY_REJECTED_MESSAGE } from "../../common/constants";
import { ActionContext } from "../../common/types";
import { conversationPhase } from "../../common/variables";
import { yearKeyboard } from "../../keyboards";
import { updateUsersStash } from "../../users";

export async function onPrivacyAccepted(ctx: ActionContext) {
  conversationPhase.set(ctx.chat!.id, 'year')
  await ctx.editMessageReplyMarkup(undefined) // Clear inline keyboard
  updateUsersStash(ctx!.from!.id, {
    firstName: ctx!.from!.first_name,
    lastName: ctx!.from!.last_name,
    telegramUsername: ctx!.from!.username,
    telegramUserId: ctx!.from!.id,
  })
  await ctx.reply(START_REGISTRATION_MESSAGE)
  ctx.reply('What is your freshman year?', yearKeyboard)
}

export async function onPrivacyRejected(ctx: ActionContext) {
  await ctx.editMessageReplyMarkup(undefined) // Clear inline keyboard
  await ctx.reply(PRIVACY_REJECTED_MESSAGE)
}