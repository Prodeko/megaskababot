import _ from "lodash";

import type { TextCtxType } from "../../common/types.js.ts";
import { isGuild } from "../../common/validators.js.ts";
import { loginConfiramtionKeyboard } from "../../keyboards.js.ts";
import { getUserStash, updateUsersStash } from "../../users.js.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function guild(
  ctx: TextCtxType,
  guildStr: string,
  userId: number,
) {
  const guild = _.toLower(guildStr);
  if (isGuild(guild)) {
    updateUsersStash(userId, { guild });
    const user = getUserStash(userId);
    await ctx.reply(
      `Is this information valid?\nusername: ${user?.telegramUsername}\nname: ${user?.firstName} ${
        user?.lastName ?? ""
      }\nfreshman year: ${user?.freshmanYear}\nguild: ${user?.guild}`,
      loginConfiramtionKeyboard,
    );
  } else {
    await ctx.reply("Please give a proper guild");
  }
}
