import { Bot, session } from "grammy";

import {
  adminLogin,
  allEntriesFromUser,
  allPhotosFromUser,
  archive,
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
import process from "node:process";
import { MegaskabaContext } from "./common/types.ts";
import { PrismaAdapter } from "@grammyjs/storage-prisma";
import { FileAdapter } from "@grammyjs/storage-file";
import { prisma } from "../prisma/client.ts";
import { conversations, createConversation } from "@grammyjs/conversations";
import { privacy } from "./conversations/privacy.ts";
import { register } from "./conversations/register.ts";
import { entry } from "./conversations/entry.ts";
import { setBotMetadata } from "./server/setBotMetadata.ts";

if (!process.env.BOT_TOKEN) {
  throw new Error("Bot token not defined!");
}

export const bot = new Bot<MegaskabaContext>(process.env.BOT_TOKEN);

bot.use(session({
  initial: () => {
    return {};
  },
  storage: new PrismaAdapter(prisma.grammySession),
}));

setBotMetadata(bot);

bot.use(conversations({
  storage: new PrismaAdapter(prisma.grammySession),
}));

const privateBot = bot.chatType("private");

// conversations
privateBot.use(createConversation(privacy));
privateBot.use(createConversation(register));
privateBot.use(createConversation(entry));

privateBot.command("start", start);

// Standard commands
privateBot.command("entry", (ctx) => ctx.conversation.enter("entry"));
privateBot.command("entries", entries);
privateBot.command("help", help);
privateBot.command("rules", rules);
privateBot.command("removelatest", removeLatestCommand);

// Admin commands
privateBot.hears(process.env.ADMIN_PASSWORD ?? "admin", adminLogin);
privateBot.command("archive", archive);
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

privateBot.callbackQuery("entry", (ctx) => ctx.conversation.enter("entry"));
privateBot.callbackQuery("entries", entries);
privateBot.callbackQuery("removelatest", removeLatestCommand);
privateBot.callbackQuery("help", help);
privateBot.callbackQuery("rules", rules);

// Inline keyboard handling
// privateBot.callbackQuery("accepted", onPrivacyAccepted);

// privateBot.callbackQuery("rejected", onPrivacyRejected);
// Enable graceful stop
process.once("SIGINT", () => bot.stop());
process.once("SIGTERM", () => bot.stop());
