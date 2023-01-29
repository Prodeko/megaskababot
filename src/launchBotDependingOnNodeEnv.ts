import express from 'express'
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

/**
 * Launch bot in long polling (development) mode
 */
function launchLongPollBot(bot: Telegraf<Context<Update>>) {
  bot.launch()
  return
}

/**
 * Launch bot in webhook (production) mode
 */
function launchWebhookBot(bot: Telegraf<Context<Update>>) {
  const port = parseInt(process.env.PORT!)

  // Necessary because of Azure App Service health check on startup
  const app = express();

  app.get('/', (_req, res) => {
    res.send('Kovaa tulee')
  })

  // Workaround to avoid issue with TSconfig
  const createWebhookListener = async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    app.use(await bot.createWebhook({ domain: process.env.DOMAIN! }))
  }
  createWebhookListener()

  app.listen(port, () => console.log('Running on port ', port))
}


/**
 * Launches the bot in webhook mode if NODE_ENV is "production", or long polling (development) mode otherwise.
 * If webhook mode is used, the bot is also wrapped in a dummy Express API so it can be run in an Azure App Service.
 */
export default function launchBotBasedOnNodeEnv(bot: Telegraf<Context<Update>>) {
  const useWebhook = process.env.NODE_ENV === "production"

  if (useWebhook) {
    console.log("Launching bot in webhook mode")
    launchWebhookBot(bot)
  } else {
    console.log("Launching bot in long polling mode")
    launchLongPollBot(bot)
  }
}