// @ts-types="npm:@types/express"
import express from "express";
import { saveEntriesAsCSV } from "../entries.ts";
import analyticsRouter from "./analytics.ts";
import process from "node:process";

const port = Number.parseInt(process.env.PORT!);

const app = express();

// Parse JSON body for webhook handler
app.use(express.json());

// Necessary because of Azure App Service health check on startup
app.get("/", (_req, res) => {
  res.status(200).send("Kovaa tulee");
});

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
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

export const launchServer = () => {
  app.listen(port, () => console.log("Running on port ", port));
};

export default app;
