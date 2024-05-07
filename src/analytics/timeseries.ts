import _ from "lodash";
import { prisma } from "../../config";
import { GUILDS } from "../common/constants";
import type { Guild, TimeSeriesData } from "../common/types";

export const getTimeSeriesData = async (): Promise<TimeSeriesData> => {
    console.log("Getting time series data");
    const data = await prisma.$queryRaw`
        WITH "PointsByDate" AS (
            SELECT
                DATE_TRUNC('day', "Entry"."createdAt" AT TIME ZONE 'EEST' ) as "date",
                "guild",
                SUM("earnedPoints") as "totalPoints"
            FROM
                "Entry" JOIN "User" ON "Entry"."userId" = "User"."telegramUserId"
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
}
