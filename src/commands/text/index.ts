import { Composer } from "grammy";
import { conversationPhase } from "../../common/variables.ts";
import distance from "./distance.ts";
import guild from "./guild.ts";
import sport from "../../conversations/sport.ts";
import year from "./year.ts";

const text = new Composer();

text.on("message:text", async (ctx) => {
  const chatId = ctx.chat.id;
  const userId = ctx.update.message.from.id;
  const text = ctx.update.message.text;
  switch (conversationPhase.get(chatId)) {
    case "year":
      await year(ctx, text, userId, chatId);
      break;

    case "guild":
      await guild(ctx, text, userId);
      break;

    case "sport":
      await sport(ctx, text, chatId);
      break;

    case "dist":
      await distance(ctx, text, chatId, userId);
      break;
  }
});

export default text;
