import express from "express";
import { validatePeriod } from "./validators.ts";
import { calculateGuildStatistics } from "../analytics/statistics.ts";
import topUsersByGuild from "../analytics/rankings.ts";
import { arrayToCSV } from "../common/utils.ts";
import { getTimeSeriesData } from "../analytics/timeseries.ts";
import { GUILDS } from "../common/constants.ts";
import _ from "lodash";
import { Guild } from "../common/types.ts";

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
  if (!req.query.limit || !(typeof req.query.limit === "string")) {
    return res
      .status(400)
      .send("Limit query parameter is required as a string");
  }
  const limit = Number.parseInt((req.query.limit as string) ?? "10");
  try {
    const topUsers = (await topUsersByGuild(guild, limit)) as Record<
      string,
      unknown
    >[];
    const csv = arrayToCSV(
      [
        "userId",
        "telegramUsername",
        "firstName",
        "lastName",
        "totalPoints",
        "totalEntries",
      ],
      topUsers,
    );
    res.header("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while calculating rankings");
  }
});

router.get("/time-series", async (req, res) => {
  if (req.query.pass !== process.env.ADMIN_PASSWORD) {
    console.log("Wrong password");
    return res.status(401).send("Wrong password!");
  }

  const timeSeries = await getTimeSeriesData();

  const groupedSeries = _.groupBy(timeSeries, (e) => e.date);
  const guildsAsColumns = _.map(groupedSeries, (entries, date) => {
    return {
      date: entries[0].date.toLocaleDateString("fi-FI"),
      ...(Object.fromEntries(
        entries.map((e) => [e.guild, e.totalPoints]),
      ) as Record<Guild, number>),
    };
  });

  const csv = arrayToCSV(["date", ...GUILDS], guildsAsColumns);

  res.header("Content-Type", "text/csv");
  res.status(200).send(csv);
});

router.get("/statistics", async (req, res: StatisticsResponse) => {
  if (req.query.pass !== process.env.ADMIN_PASSWORD) {
    console.log("Wrong password");
    return res.status(401).send("Wrong password!");
  }

  const validatedRes = validatePeriod(req, res);

  const { periodStart, periodEnd } = validatedRes.locals;
  try {
    const statistics = await calculateGuildStatistics(periodStart, periodEnd);
    validatedRes.json(Object.fromEntries(statistics));
  } catch (error) {
    console.error(error);
    validatedRes.status(500).send(
      "An error occurred while calculating statistics",
    );
  }
});

export default router;
