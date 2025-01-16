import _ from "lodash";

import { isGuild } from "../../common/validators.ts";
import { loginConfiramtionKeyboard } from "../../keyboards.ts";
import { getUserStash, updateUsersStash } from "../../users.ts";
import { ChatTypeContext } from "grammy";
import { MegaskabaContext } from "../../common/types.ts";

export default async function guild(
  ctx: ChatTypeContext<MegaskabaContext, "private">,
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
      { reply_markup: loginConfiramtionKeyboard },
    );
  } else {
    await ctx.reply("Please give a proper guild");
  }
}
