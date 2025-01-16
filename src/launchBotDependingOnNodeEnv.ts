import { Api, Bot, Context, RawApi, webhookCallback } from "grammy";
import app, { launchServer } from "./server/index.ts";
import process from "node:process";

/**
 * Launch bot in long polling (development) mode
 */
async function launchLongPollBot<T extends Context>(bot: Bot<T, Api<RawApi>>) {
  await bot.start();
  launchServer();
}

/**
 * Launch bot in webhook (production) mode
 */
function launchWebhookBot<T extends Context>(bot: Bot<T, Api<RawApi>>) {
  // Workaround to avoid issue with TSconfig
  app.use(webhookCallback(bot, "express"));
  launchServer();
}

/**
 * Launches the bot in webhook mode if NODE_ENV is "production", or long polling (development) mode otherwise.
 * If webhook mode is used, the bot is also wrapped in a dummy Express API so it can be run in an Azure App Service.
 */
export default async function launchBotBasedOnNodeEnv<T extends Context>(
  bot: Bot<T, Api<RawApi>>,
) {
  const useWebhook = process.env.NODE_ENV === "production";

  if (useWebhook) {
    console.log("Launching bot in webhook mode");
    await launchWebhookBot(bot);
  } else {
    console.log("Launching bot in long polling mode");
    launchLongPollBot(bot);
  }
}
