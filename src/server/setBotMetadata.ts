import { Bot } from "grammy";
import { MegaskabaContext } from "../common/types.ts";

export async function setBotMetadata(bot: Bot<MegaskabaContext>) {
  // TODO: Localize
  try {
    await Promise.all([
      bot.api.setMyCommands([
        { command: "start", description: "Start the bot" },
        { command: "help", description: "Show the help message" },
        { command: "rules", description: "Show the rules of the competition" },
        { command: "entry", description: "Add a new entry" },
        { command: "entries", description: "Show your previous entries" },
        { command: "removelatest", description: "Remove your latest entry" },
      ]),
      bot.api.setMyName("Megaskababot"),
      bot.api.setMyDescription(
        "Megaskababot allows you to keep track of your entries in Megaskaba.",
      ),
      bot.api.setMyShortDescription(
        "Megaskababot allows you to keep track of your entries in Megaskaba.",
      ),
    ]);
  } catch (e) {
    // Prevent crash due to ratelimit
    console.error(e);
  }
}
