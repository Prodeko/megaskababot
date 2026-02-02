import { randomUUID } from "node:crypto";
import path from "node:path";
import process from "node:process";
import { webhookCallback } from "grammy";
import { Express } from "express";
import { bot } from "../bot.ts";

export async function attachWebhook(app: Express) {
  const webhookRoute = "/webhook";
  const webhookBaseUrl = process.env.WEBHOOK_URL!;
  const webhookUrl = path.join(webhookBaseUrl, webhookRoute);

  const token = randomUUID();
  await bot.api.setWebhook(webhookUrl, { secret_token: token });

  app.post(
    "/webhook",
    webhookCallback(bot, "express", {
      secretToken: token,
    }),
  );
}
