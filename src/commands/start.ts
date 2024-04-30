import {
	INTRODUCTORY_MESSAGE,
	PRIVACY_POLICY,
	START_REGISTRATION_MESSAGE,
} from "../common/constants";
import type { CommandContext } from "../common/types";
import { isBigInteger } from "../common/validators";
import { conversationPhase } from "../common/variables";
import {
	commandsKeyboard,
	inlinePrivacyKeyboard,
	yearKeyboard,
} from "../keyboards";
import { isUser, updateUsersStash } from "../users";

const start = async (ctx: CommandContext, next: () => Promise<void>) => {
	const userId = ctx.message.from.id;

	// Assuming that all users that have their data in the database have accepted the privacy policy.
	const userExistsInDatabase = await isUser(userId);
	const isNewChat =
		!conversationPhase.has(ctx.chat.id) && !userExistsInDatabase;

	if (isNewChat) {
		await ctx.reply(INTRODUCTORY_MESSAGE);
		await ctx.reply(PRIVACY_POLICY, inlinePrivacyKeyboard);
		return;
	}

	const telegramUserId = ctx.message.from.id;
	if (!isBigInteger(telegramUserId)) {
		throw TypeError("Invalid user ID received from ctx");
	}

	if (!userExistsInDatabase) {
		conversationPhase.set(ctx.chat.id, "year");
		updateUsersStash(userId, {
			firstName: ctx.message.from.first_name,
			lastName: ctx.message.from.last_name,
			telegramUsername: ctx.message.from.username,
			telegramUserId,
		});
		await ctx.reply(`Welcome to GIGASKABA! ${START_REGISTRATION_MESSAGE}`);
		await ctx.reply("What is your freshman year?", yearKeyboard);
	} else {
		await ctx.reply(
			"Welcome back to GIGASKABA! What would you like to do?",
			commandsKeyboard,
		);
	}
	return next();
};

export default start;
