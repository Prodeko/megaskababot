import _ from "lodash";
import { InlineKeyboard, Keyboard } from "grammy";

import { GUILDS, SPORTS, YEARS } from "./common/constants.ts";

export const inlinePrivacyKeyboard = new InlineKeyboard()
  .text("Accept ✅", "accepted").text("Reject ❌", "rejected");

export const guildKeyboard = Keyboard.from(
  GUILDS.map(_.capitalize).map((g) => [Keyboard.text(g)]),
).oneTime(
  true,
);
export const yearKeyboard = Keyboard.from(YEARS.map((y) => [Keyboard.text(y)]))
  .oneTime(true);
export const sportKeyboard = Keyboard.from(
  [...SPORTS].map((s) => [Keyboard.text(s)]),
).oneTime(true);
export const confirmationKeyboard = new InlineKeyboard()
  .text("Remove 🗑️", "remove")
  .text("Cancel 🚫", "cancel");

export const loginConfiramtionKeyboard = new InlineKeyboard()
  .text("Yes, that's correct ✅", "login")
  .text("No, try again 🚫", "cancel_login");

export const validationKeyboard = new InlineKeyboard()
  .text("1️⃣x ✅", "valid1x")
  .text("2️⃣x ✅", "valid2x")
  .text("Invalid ❌", "invalid")
  .row()
  .text("Stop validation 🛑", "stopvalidation");

export const commandsKeyboard = new InlineKeyboard()
  .text("New entry 🆕", "entry")
  .text("Previous entries 📈", "entries")
  .row()
  .text("Remove latest 🗑️", "removelatest")
  .text("Rules 📖", "rules")
  .row()
  .text("Help 💡", "help");
