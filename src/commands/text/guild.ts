import _ from "lodash";

import type { TextCtxType } from "../../common/types";
import { isGuild } from "../../common/validators";
import { loginConfiramtionKeyboard } from "../../keyboards";
import { getUserStash, updateUsersStash } from "../../users";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function guild(
	ctx: TextCtxType,
	guildStr: string,
	userId: number,
) {
	const guild = _.lowerCase(guildStr);
	if (isGuild(guild)) {
		updateUsersStash(userId, { guild });
		const user = getUserStash(userId);
		await ctx.reply(
			`Is this information valid?\nusername: ${user?.telegramUsername}\nname: ${
				user?.firstName
			} ${user?.lastName ?? ""}\nfreshman year: ${user?.freshmanYear}\nguild: ${
				user?.guild
			}`,
			loginConfiramtionKeyboard,
		);
	} else {
		await ctx.reply("Please give a proper guild");
	}
}
