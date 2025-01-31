import { Bot, session } from "grammy";

import {
  adminLogin,
  allEntriesFromUser,
  allPhotosFromUser,
  cancelRemove,
  confirmedRemove,
  csv,
  invalid,
  notValidated,
  pistokoe,
  remove,
  resetValidation,
  setDistance,
  stopValidation,
  valid1x,
  valid2x,
  validate,
} from "./commands/admin.ts";
import entries from "./commands/entries.ts";
import help from "./commands/help.ts";
import removeLatestCommand from "./commands/removeLatest.ts";
import rules from "./commands/rules.ts";
import start from "./commands/start.ts";
import launchBotDependingOnNodeEnv from "./launchBotDependingOnNodeEnv.ts";
import process from "node:process";
import { MegaskabaContext } from "./common/types.ts";
import { PrismaAdapter } from "@grammyjs/storage-prisma";
import { prisma } from "../prisma/client.ts";
import { conversations, createConversation } from "@grammyjs/conversations";
import { privacy } from "./conversations/privacy.ts";
import { register } from "./conversations/register.ts";
import { entry } from "./conversations/entry.ts";

if (!process.env.BOT_TOKEN) {
  throw new Error("Bot token not defined!");
}

const bot = new Bot<MegaskabaContext>(process.env.BOT_TOKEN);
bot.use(session({
  initial: () => {
    return {};
  },
  storage: new PrismaAdapter(prisma.grammySession),
}));

bot.use(conversations());

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

const privateBot = bot.chatType("private");

// conversations
privateBot.use(createConversation(privacy));
privateBot.use(createConversation(register));
privateBot.use(createConversation(entry));

privateBot.command("start", start);

// Standard commands
privateBot.command("entry", (ctx) => ctx.conversation.reenter("entry"));
privateBot.command("entries", entries);
privateBot.command("help", help);
privateBot.command("rules", rules);
privateBot.command("removelatest", removeLatestCommand);

// Admin commands
privateBot.hears(process.env.ADMIN_PASSWORD ?? "admin", adminLogin);
privateBot.command("csv", csv);
privateBot.command("pistokoe", pistokoe);
privateBot.command("numtovalidate", notValidated);
privateBot.command("remove", remove);
privateBot.command("allphotos", allPhotosFromUser);
privateBot.command("resetvalidation", resetValidation);
privateBot.command("updatedistance", setDistance);
privateBot.command("validate", validate);
privateBot.command("allentries", allEntriesFromUser);

privateBot.callbackQuery("invalid", invalid);
privateBot.callbackQuery("valid1x", valid1x);
privateBot.callbackQuery("valid2x", valid2x);
privateBot.callbackQuery("stopvalidation", stopValidation);

privateBot.callbackQuery("remove", confirmedRemove);
privateBot.callbackQuery("cancel", cancelRemove);

privateBot.callbackQuery("entry", (ctx) => ctx.conversation.reenter("entry"));
privateBot.callbackQuery("entries", entries);
privateBot.callbackQuery("removelatest", removeLatestCommand);
privateBot.callbackQuery("help", help);
privateBot.callbackQuery("rules", rules);

// Inline keyboard handling
// privateBot.callbackQuery("accepted", onPrivacyAccepted);

// privateBot.callbackQuery("rejected", onPrivacyRejected);
// Launch privateBot
launchBotDependingOnNodeEnv(bot);

// Enable graceful stop
process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());
