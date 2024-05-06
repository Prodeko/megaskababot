import _ from "lodash";
import { prisma } from "../../config";
import { GUILDS } from "../common/constants";
import type { TimeSeriesData } from "../common/types";

export const getTimeSeriesData = async (): Promise<TimeSeriesData> => {
    const data = await prisma.$queryRaw`
        WITH "PointsByDate" AS (
            SELECT
                DATE_TRUNC('day', "Entry"."createdAt") as "date",
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
            SUM("totalPoints") OVER (ORDER BY "date") as "totalPoints"
        FROM
            "PointsByDate"
        ORDER BY
            "date" ASC

    ` as {
        date: Date;
        guild: string;
        totalPoints: number;
    }[];

    return data;
}
