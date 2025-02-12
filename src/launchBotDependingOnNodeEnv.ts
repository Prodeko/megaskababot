import { Api, Bot, Context, RawApi, webhookCallback } from "grammy";
import app, { launchServer } from "./server/index.ts";
import process from "node:process";
import path from "node:path";

/**
 * Launch bot in long polling (development) mode
 */
async function launchLongPollBot<T extends Context>(bot: Bot<T, Api<RawApi>>) {
  launchServer();
  bot.start().catch((e) => console.error(e));
}

/**
 * Launch bot in webhook (production) mode
 */
async function launchWebhookBot<T extends Context>(bot: Bot<T, Api<RawApi>>) {
  const webhookRoute = "/webhook";
  const webhookBaseUrl = process.env.WEBHOOK_URL!;
  const webhookUrl = path.join(webhookBaseUrl, webhookRoute);

  // TODO: add secret token to this call
  await bot.api.setWebhook(webhookUrl);
  app.post("/webhook", webhookCallback(bot, "express"));
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
    try {
      await launchWebhookBot(bot);
    } catch (e) {
      console.error(
        "Failed to launch webhook bot - falling back to long polling!",
        e,
      );

      launchLongPollBot(bot);
    }
  } else {
    console.log("Launching bot in long polling mode");
    launchLongPollBot(bot);
  }
}
