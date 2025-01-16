import _ from "lodash";

import { isSport } from "../../common/validators.ts";
import { conversationPhase } from "../../common/variables.ts";
import { updateEntryStash } from "../../entries.ts";
import { ChatTypeContext } from "grammy";
import { MegaskabaContext } from "../../common/types.ts";

export default async function sport(
  ctx: ChatTypeContext<MegaskabaContext, "private">,
  sportStr: string,
  chatId: number,
) {
  const sport = _.toLower(sportStr);
  if (isSport(sport)) {
    updateEntryStash(chatId, { sport: sport });
    await ctx.reply(`What distance (km) did you ${sport}?`);
    conversationPhase.set(chatId, "dist");
  } else {
    await ctx.reply("Please give a proper sport");
  }
}
