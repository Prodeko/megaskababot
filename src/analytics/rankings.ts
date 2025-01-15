import { prisma } from "../../config.ts";

const topUsersByGuild = async (guild: string, limit: number) => {
	const topUsers = await prisma.$queryRaw`
    SELECT
      "userId",
      "telegramUsername",
      "firstName",
      "lastName",
      SUM("earnedPoints") as "totalPoints",
      COUNT(*) as "totalEntries"
    FROM
      "Entry" JOIN "User" ON "Entry"."userId" = "User"."telegramUserId"
    WHERE
      "guild" = ${guild}
    GROUP BY
      "userId",
      "telegramUsername",
      "firstName",
      "lastName"
    ORDER BY
      "totalPoints" DESC
    LIMIT
      ${limit}
  `;
	return topUsers;
};

export default topUsersByGuild;
