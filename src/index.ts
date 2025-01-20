import { Bot, session } from "grammy";

import cancelLogin from "./commands/action/cancelLogin.ts";
import confirmLogin from "./commands/action/confirmLogin.ts";
import {
  onPrivacyAccepted,
  onPrivacyRejected,
} from "./commands/action/privacy.ts";
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
import entry from "./commands/entry.ts";
import help from "./commands/help.ts";
import removeLatestCommand from "./commands/removeLatest.ts";
import rules from "./commands/rules.ts";
import start from "./commands/start.ts";
import text from "./commands/text/index.ts";
import photo from "./commands/photo.ts";
import launchBotDependingOnNodeEnv from "./launchBotDependingOnNodeEnv.ts";
import process from "node:process";
import { MegaskabaContext } from "./common/types.ts";
import { PrismaAdapter } from "@grammyjs/storage-prisma";
import { prisma } from "../prisma/client.ts";
import { conversations } from "@grammyjs/conversations";

if (!process.env.BOT_TOKEN) {
  throw new Error("privateBot token not defined!");
}

const bot = new Bot<MegaskabaContext>(process.env.BOT_TOKEN);
bot.use(session({
  initial: () => {
    return {};
  },
  storage: new PrismaAdapter(prisma.grammySession),
}));

bot.use(conversations())
const privateBot = bot.chatType("private");

privateBot.command("start", start);

// Message handling
privateBot.use(text);
privateBot.use(photo);

// Standard commands
privateBot.command("entries", entries);
privateBot.command("help", help);
privateBot.command("rules", rules);
privateBot.command("entry", entry);
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

privateBot.callbackQuery("login", confirmLogin);
privateBot.callbackQuery("cancel_login", cancelLogin);

privateBot.callbackQuery("entry", entry);
privateBot.callbackQuery("entries", entries);
privateBot.callbackQuery("removelatest", removeLatestCommand);
privateBot.callbackQuery("help", help);
privateBot.callbackQuery("rules", rules);

// Inline keyboard handling
privateBot.callbackQuery("accepted", onPrivacyAccepted);

privateBot.callbackQuery("rejected", onPrivacyRejected);

privateBot.use(async (ctx) => {
  try {
    await ctx.editMessageReplyMarkup(undefined);
  } catch (e) {
    console.log(e);
  }
});

// Launch privateBot
launchBotDependingOnNodeEnv(bot);

// Enable graceful stop
process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());
