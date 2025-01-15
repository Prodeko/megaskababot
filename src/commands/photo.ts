import { Composer } from "grammy";
import { STICKERS } from "../common/constants.ts";
import { conversationPhase } from "../common/variables.ts";
import { entryToDb, updateEntryStash } from "../entries.ts";
import { commandsKeyboard } from "../keyboards.ts";

const photo = new Composer();

photo.on("message:photo", async (ctx) => {
  const chatId = ctx.chat.id;
  if (conversationPhase.get(ctx.chat.id) !== "proof") return;
  try {
    const fileId = ctx.message?.photo[3]?.file_id ??
      ctx.message?.photo[2]?.file_id ??
      ctx.message?.photo[1]?.file_id;
    updateEntryStash(chatId, { fileId });
    await entryToDb(chatId);
    await ctx.replyWithSticker(
      STICKERS[Math.floor(Math.random() * STICKERS.length)],
    );
    await ctx.reply("Entry added!", { reply_markup: commandsKeyboard });
    conversationPhase.delete(chatId);
  } catch (e) {
    console.log(e);
    await ctx.reply("That did not work 😔 Please try again");
  }
});

export default photo;
