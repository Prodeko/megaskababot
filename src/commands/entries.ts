import _ from "lodash";

import { formatEntry } from "../common/utils.ts";
import { getEntriesByUserId } from "../entries.ts";
import { commandsKeyboard } from "../keyboards.ts";
import {
  PrivateCallbackMegaskabaContext,
  PrivateCommandMegaskabaContext,
} from "../common/types.ts";

const entries = async (
  ctx: PrivateCommandMegaskabaContext | PrivateCallbackMegaskabaContext,
  next: () => Promise<void>,
) => {
  const entries = await getEntriesByUserId(ctx!.from!.id);

  if (entries.length > 0) {
    const validEntries = entries.filter((e) => e.valid !== false);
    const points = validEntries
      .map((e) => e.earnedPoints)
      .reduce((p, e) => p + e, 0);

    const distance = validEntries.reduce((p, e) => p + e.distance, 0);

    const distanceBySport = Object.entries(
      _.groupBy(validEntries, (e) => e.sport),
    ).map<[string, number]>(([key, value]) => [
      key,
      value.reduce((p, e) => p + e.distance, 0),
    ]);

    // there is a limit to the size of a tg message, 50 entries should fit (100 didn't!)
    const chunks = _.chunk(entries, 50);

    // This has to be a for-of loop to avoid messages arriving out of orded
    for (const chunk of chunks) {
      await ctx.reply(chunk.map((e) => formatEntry(e)).join("\n\n"), {
        parse_mode: "HTML",
      });
    }

    await ctx.reply(
      ["<strong>Totals</strong>"]
        .concat(distanceBySport.map(([sport, dist]) => `${sport}: ${dist} km`))
        .join("\n") +
        "\n" +
        [
          `Total distance: ${
            distance.toFixed(
              2,
            )
          } km\nTotal points: ${points.toFixed(2)} points`,
        ].join("\n\n"),
      { parse_mode: "HTML", reply_markup: commandsKeyboard },
    );
  } else {
    await ctx.reply("No entries yet!", { reply_markup: commandsKeyboard });
  }
  await next();
};

export default entries;
