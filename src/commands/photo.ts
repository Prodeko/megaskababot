import { STICKERS } from "../common/constants.ts";
import type { PhotoCtxType } from "../common/types.ts";
import { conversationPhase } from "../common/variables.ts";
import { entryToDb, updateEntryStash } from "../entries.ts";
import { commandsKeyboard } from "../keyboards.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function proof(
	ctx: PhotoCtxType,
	next: () => Promise<void>,
) {
	const chatId = ctx.chat.id;
	if (conversationPhase.get(ctx.chat.id) !== "proof") return next();
	try {
		const fileId =
			ctx.message?.photo[3]?.file_id ??
			ctx.message?.photo[2]?.file_id ??
			ctx.message?.photo[1]?.file_id;
		updateEntryStash(chatId, { fileId });
		await entryToDb(chatId);
		await ctx.replyWithSticker(
			STICKERS[Math.floor(Math.random() * STICKERS.length)],
		);
		await ctx.reply("Entry added!", commandsKeyboard);
		conversationPhase.delete(chatId);
	} catch (e) {
		console.log(e);
		await ctx.reply("That did not work 😔 Please try again");
	}
	return next();
}
