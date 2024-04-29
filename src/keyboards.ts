import _ from "lodash";
import { Markup } from "telegraf";

import { GUILDS, SPORTS, YEARS } from "./common/constants";

export const inlinePrivacyKeyboard = Markup.inlineKeyboard([
	[
		{ text: "Accept ✅", callback_data: "accepted" },
		{ text: "Reject ❌", callback_data: "rejected" },
	],
]);

export const guildKeyboard = Markup.keyboard(GUILDS.map(_.capitalize)).oneTime(
	true,
);
export const yearKeyboard = Markup.keyboard(YEARS).oneTime(true);
export const sportKeyboard = Markup.keyboard([...SPORTS]).oneTime(true);
export const confirmationKeyboard = Markup.inlineKeyboard([
	Markup.button.callback("Remove 🗑️", "remove"),
	Markup.button.callback("Cancel 🚫", "cancel"),
]);

export const loginConfiramtionKeyboard = Markup.inlineKeyboard([
	Markup.button.callback("Yes, that's correct ✅", "login"),
	Markup.button.callback("No, try again 🚫", "cancel_login"),
]);

export const validationKeyboard = Markup.inlineKeyboard([
	[
		Markup.button.callback("1️⃣x ✅", "valid1x"),
		Markup.button.callback("2️⃣x ✅", "valid2x"),
		Markup.button.callback("Invalid ❌", "invalid"),
	],
	[Markup.button.callback("Stop validation 🛑", "stopvalidation")],
]);

export const commandsKeyboard = Markup.inlineKeyboard([
	[
		{ text: "New entry 🆕", callback_data: "entry" },
		{ text: "Previous entries 📈", callback_data: "entries" },
	],
	[
		{ text: "Remove latest 🗑️", callback_data: "removelatest" },
		{ text: "Rules 📖", callback_data: "rules" },
	],
	[{ text: "Help 💡", callback_data: "help" }],
]);
