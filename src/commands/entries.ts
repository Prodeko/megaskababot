import _ from "lodash";

import { COEFFICIENTS } from "../common/constants";
import type { ActionContext, CommandContext } from "../common/types";
import { formatEntry } from "../common/utils";
import { getEntries } from "../entries";
import { commandsKeyboard } from "../keyboards";

const entries = async (
	ctx: CommandContext | ActionContext,
	next: () => Promise<void>,
) => {
	const entries = await getEntries(ctx!.from!.id);

	if (entries.length > 0) {
		const points = entries
			.map((e) => e.distance * COEFFICIENTS[e.sport] * (e.doublePoints ? 2 : 1))
			.reduce((p, e) => p + e, 0);

		const distance = entries.reduce((p, e) => p + e.distance, 0);

		const distanceBySport = Object.entries(
			_.groupBy(entries, (e) => e.sport),
		).map<[string, number]>(([key, value]) => [
			key,
			value.reduce((p, e) => p + e.distance, 0),
		]);

		// there is a limit to the size of a tg message, 50 entries should fit (100 didn't!)
		const chunks = _.chunk(entries, 50);

		// This has to be a for-of loop to avoid messages arriving out of orded
		for (const chunk of chunks) {
			await ctx.replyWithHTML(chunk.map(formatEntry).join("\n\n"));
		}

		await ctx.replyWithHTML(
			["<strong>Totals</strong>"]
				.concat(distanceBySport.map(([sport, dist]) => `${sport}: ${dist} km`))
				.join("\n") +
				"\n" +
				[
					`Total distance: ${distance.toFixed(
						2,
					)} km\nTotal points: ${points.toFixed(2)} points`,
				].join("\n\n"),
			commandsKeyboard,
		);
	} else {
		await ctx.reply("No entries yet!", commandsKeyboard);
	}
	return next();
};

export default entries;
