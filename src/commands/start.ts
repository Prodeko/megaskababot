import { ChatTypeContext, CommandContext, Context } from "grammy";
import {
  INTRODUCTORY_MESSAGE,
  PRIVACY_POLICY,
  START_REGISTRATION_MESSAGE,
} from "../common/constants.ts";
import { isBigInteger } from "../common/validators.ts";
import { conversationPhase } from "../common/variables.ts";
import {
  commandsKeyboard,
  inlinePrivacyKeyboard,
  yearKeyboard,
} from "../keyboards.ts";
import { isUser, updateUsersStash } from "../users.ts";

const start = async (ctx: CommandContext<ChatTypeContext<Context, "private">>, next: () => Promise<void>) => {
  const userId = ctx.chatId

  // Assuming that all users that have their data in the database have accepted the privacy policy.
  const userExistsInDatabase = await isUser(userId);
  const isNewChat = !conversationPhase.has(ctx.chat.id) &&
    !userExistsInDatabase;

  if (isNewChat) {
    await ctx.reply(INTRODUCTORY_MESSAGE);
    await ctx.reply(PRIVACY_POLICY, {reply_markup: inlinePrivacyKeyboard});
    return;
  }

  if (!isBigInteger(userId)) {
    throw TypeError("Invalid user ID received from ctx");
  }

  if (!userExistsInDatabase) {
    conversationPhase.set(ctx.chat.id, "year");
    updateUsersStash(userId, {
      firstName: ctx.message.from.first_name,
      lastName: ctx.message.from.last_name,
      telegramUsername: ctx.message.from.username,
      telegramUserId: userId,
    });
    await ctx.reply(`Welcome to GIGASKABA! ${START_REGISTRATION_MESSAGE}`);
    await ctx.reply("What is your freshman year?", {reply_markup: yearKeyboard});
  } else {
    await ctx.reply(
      "Welcome back to GIGASKABA! What would you like to do?",
      {reply_markup: commandsKeyboard},
    );
  }
  return next();
};

export default start;
