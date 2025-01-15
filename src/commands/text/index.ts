import type { TextCtxType } from "../../common/types.ts";
import { conversationPhase } from "../../common/variables.ts";
import distance from "./distance.ts";
import guild from "./guild.ts";
import sport from "./sport.ts";
import year from "./year.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const text = async (ctx: TextCtxType, next: () => Promise<void>) => {
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

  return next();
};

export default text;
