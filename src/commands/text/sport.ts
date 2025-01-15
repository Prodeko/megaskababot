import _ from "lodash";

import type { TextCtxType } from "../../common/types.js.ts";
import { isSport } from "../../common/validators.js.ts";
import { conversationPhase } from "../../common/variables.js.ts";
import { updateEntryStash } from "../../entries.js.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function sport(
  ctx: TextCtxType,
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
