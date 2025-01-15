import * as dotenv from "dotenv";
import { Telegraf } from "telegraf";

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
import photo from "./commands/photo.ts";
import removeLatestCommand from "./commands/removeLatest.ts";
import rules from "./commands/rules.ts";
import start from "./commands/start.ts";
import text from "./commands/text/index.ts";
import launchBotDependingOnNodeEnv from "./launchBotDependingOnNodeEnv.ts";
import process from "node:process";

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw new Error("Bot token not defined!");
}

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(start);

// Message handling
bot.on("text", text);
bot.on("photo", photo);

// Standard commands
bot.command("entries", entries);
bot.command("help", help);
bot.command("rules", rules);
bot.command("entry", entry);
bot.command("removelatest", removeLatestCommand);

// Middleware to get stickerids
// eslint-disable-next-line prefer-const
// let fileIds: string[] = []
// bot.use((ctx:any, next) => {
//   if (!ctx?.message?.sticker) return next()
//   const fileId = ctx?.message?.sticker?.file_id
//   fileIds.push(fileId)
//   console.log(fileIds)
//   return next()
// })

// Admin commands
bot.hears(process.env.ADMIN_PASSWORD ?? "admin", adminLogin);
bot.command("csv", csv);
bot.command("pistokoe", pistokoe);
bot.command("numtovalidate", notValidated);
bot.command("remove", remove);
bot.command("allphotos", allPhotosFromUser);
bot.command("resetvalidation", resetValidation);
bot.command("updatedistance", setDistance);
bot.command("validate", validate);
bot.command("allentries", allEntriesFromUser);

bot.action("invalid", invalid);
bot.action("valid1x", valid1x);
bot.action("valid2x", valid2x);
bot.action("stopvalidation", stopValidation);

bot.action("remove", confirmedRemove);
bot.action("cancel", cancelRemove);

bot.action("login", confirmLogin);
bot.action("cancel_login", cancelLogin);

bot.action("entry", entry);
bot.action("entries", entries);
bot.action("removelatest", removeLatestCommand);
bot.action("help", help);
bot.action("rules", rules);

// Inline keyboard handling
bot.action("accepted", onPrivacyAccepted);

bot.action("rejected", onPrivacyRejected);

bot.use(async (ctx) => {
  try {
    await ctx.editMessageReplyMarkup(undefined);
    // deno-lint-ignore no-empty
  } catch {}
});

// Launch bot
launchBotDependingOnNodeEnv(bot);

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
