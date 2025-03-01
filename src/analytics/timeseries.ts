import _ from "lodash";
import type { TimeSeriesData } from "../common/types.ts";
import { prisma } from "../../prisma/client.ts";

export const getTimeSeriesData = async (): Promise<TimeSeriesData> => {
  console.log("Getting time series data");
  const data = await prisma.$queryRaw`
        WITH "PointsByDate" AS (
            SELECT
                DATE_TRUNC('day', "Entry"."createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'EET' ) as "date",
                "guild",
                SUM("earnedPoints") as "totalPoints"
            FROM
                "Entry" JOIN "User" ON "Entry"."userId" = "User"."telegramUserId"
            WHERE
                "Entry"."valid" IS NOT FALSE
            GROUP BY
                "date",
                "guild"
        )

        SELECT
            "date",
            "guild",
            SUM("totalPoints") OVER (PARTITION BY "guild" ORDER BY "date") as "totalPoints"
        FROM
            "PointsByDate"
        ORDER BY
            "date" ASC;
    ` as TimeSeriesData;

  console.log(data);

  return data;
};
