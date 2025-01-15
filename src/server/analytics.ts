import express from "express";
import { validatePeriod } from "./middleware";
import { calculateGuildStatistics } from "../analytics/statistics";
import topUsersByGuild from "../analytics/rankings";
import { arrayToCSV } from "../common/utils";
import process from "node:process";

const router = express.Router({ mergeParams: true });

export interface StatisticsResponse extends express.Response {
  locals: {
    guild: string;
    periodStart: Date;
    periodEnd: Date;
  };
}

router.get("/ranking/:guild", async (req, res: StatisticsResponse) => {
  if (req.query.pass !== process.env.ADMIN_PASSWORD) {
    console.log("Wrong password");
    return res.status(401).send("Wrong password!");
  }

  const guild = req.params.guild;
  if (!req.query.limit || !((typeof req.query.limit) === "string")) {
    return res.status(400).send(
      "Limit query parameter is required as a string",
    );
  }
  const limit = Number.parseInt(req.query.limit as string ?? "10");
  try {
    const topUsers = await topUsersByGuild(guild, limit) as Record<
      string,
      unknown
    >[];
    const csv = arrayToCSV([
      "userId",
      "telegramUsername",
      "firstName",
      "lastName",
      "totalPoints",
      "totalEntries",
    ], topUsers);
    res.header("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while calculating rankings");
  }
});

// Middleware to validate the period start and end query parameters
router.use(validatePeriod);

router.get("/statistics", async (req, res: StatisticsResponse) => {
  if (req.query.pass !== process.env.ADMIN_PASSWORD) {
    console.log("Wrong password");
    return res.status(401).send("Wrong password!");
  }

  const { periodStart, periodEnd } = res.locals;
  try {
    const statistics = await calculateGuildStatistics(periodStart, periodEnd);
    res.json(Object.fromEntries(statistics));
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while calculating statistics");
  }
});

export default router;
