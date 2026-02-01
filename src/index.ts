// @ts-types="npm:@types/express"
import express from "express";
import { saveEntriesAsCSV } from "./entries.ts";
import analyticsRouter from "./server/analytics.ts";
import process from "node:process";
import { bot } from "./bot.ts";
import fs from "node:fs";
import { attachWebhook } from "./server/attachWebhook.ts";
import { prisma } from "../prisma/client.ts";

const port = Number.parseInt(process.env.PORT!);

const useWebhook = process.env.NODE_ENV === "production";
let webhookSuccessfullyAttached = false;

const app = express();

// Parse JSON body for webhook handler
app.use(express.json());

// Necessary because of Azure App Service health check on startup
app.get("/", (_req, res) => {
  res.status(200).send("Kovaa tulee");
});

app.get("/health", async (_req, res) => {
  try {
    const start = Date.now();
    // Hit database in healthcheck to keep connection alive
    await prisma.$executeRaw`SELECT 1`;
    const end = Date.now();

    const duration = end - start;

    console.log(`Health check OK in ${duration}ms`);
    res.status(200).send("OK");
  } catch (e) {
    console.error("Health check FAIL: ", e);
    res.status(500).send();
  }
});

app.get("/entries", async (req, res, next) => {
  try {
    if (req.query.pass !== process.env.ADMIN_PASSWORD) {
      console.log("Wrong password");
      return res.status(401).send("Wrong password!");
    }
    await saveEntriesAsCSV();
    res.attachment("./entries.csv");
    res.header("Content-Type", "text/csv");
    res.status(200).send(fs.readFileSync("./entries.csv"));
  } catch (e) {
    next(e);
    return;
  }
  next();
});

app.use("/analytics", analyticsRouter);

if (useWebhook) {
  console.log("Launching bot in webhook mode");
  try {
    await attachWebhook(app);
    webhookSuccessfullyAttached = true;
  } catch (e) {
    console.error(
      "Failed to launch webhook bot - falling back to long polling!",
      e,
    );
  }
}

app.use((err, req, res, _next) => {
  console.log("Error in request: ", req.body);
  console.error(err);
  res.status(500).send("Internal server error");
});

app.listen(port, () => console.log("Running on port ", port));

// We default to long polling in dev and fall back to long polling in prod in case attaching the webhook fails
if (!webhookSuccessfullyAttached) {
  console.log("Launching bot in long polling mode");
  bot.start().catch((e) => console.error(e));
}

export default app;
