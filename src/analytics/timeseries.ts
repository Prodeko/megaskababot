import { prisma } from "../../config";
import type { TimeSeriesData } from "../common/types";

export const getTimeSeriesData = async (): Promise<TimeSeriesData> => {
    return prisma.$queryRaw`
        SELECT
            DATE_TRUNC('day', "createdAt") as "date",
            SUM("earnedPoints") OVER (ORDER BY DATE_TRUNC('day', "createdAt")) as "totalPoints",
        FROM
            "Entry" JOIN "User" ON "Entry"."userId" = "User"."telegramUserId"
        GROUP BY
            "date",
            "guild"
        ORDER BY
            "date" ASC
    `;
}
