import { prisma } from "../../config";
import { MILESTONE_LIMIT } from "../common/constants";
import type { Guild, Statistics, TeamStatistics } from "../common/types";

interface PeriodStats {
	guild: Guild;
	pointsGainedInPeriod: number;
	continuingParticipants: number;
	previousParticipants: number;
}

interface Aggregate {
	guild: Guild;
	totalPoints: number;
	totalKilometers: number;
	totalEntries: number;
	uniqueParticipants: number;
}

// Function to calculate and return the total points
export async function calculateGuildStatistics(
	periodStart: Date,
	periodEnd: Date,
): Promise<Statistics> {
	const aggregates = (await prisma.$queryRaw`
		SELECT
			guild,
			SUM("earnedPoints") as "totalPoints",
			SUM(distance) as "totalKilometers",
			COUNT(*) as "totalEntries",
			COUNT(DISTINCT "userId") as "uniqueParticipants"
		FROM
			"Entry" JOIN "User" ON "Entry"."userId" = "User"."telegramUserId"
		GROUP BY
			guild
	`) as Aggregate[];

	const milestoneAchieversByGuild = (await prisma.$queryRaw`
		WITH milestone_acchievers AS (
			SELECT
				"userId"
			FROM
				"Entry"
			GROUP BY
				"userId"
			HAVING
				SUM("earnedPoints") >= ${MILESTONE_LIMIT}
		)

		SELECT
			guild,
			COUNT(*) as "milestoneAchievers"
		FROM
			milestone_acchievers JOIN "User" ON milestone_acchievers."userId" = "User"."telegramUserId"
		GROUP BY
			guild
	`) as { guild: Guild; milestoneAchievers: number }[];

	const periodStats = (await prisma.$queryRaw`
		WITH period_stats AS (
			SELECT
				guild,
				SUM("earnedPoints") as "pointsGainedInPeriod",
				COUNT(DISTINCT "userId") as "continuingParticipants"
			FROM
				"Entry" JOIN "User" ON "Entry"."userId" = "User"."telegramUserId"
			WHERE
				"Entry"."createdAt" BETWEEN ${periodStart} AND ${periodEnd}
			GROUP BY
				guild
		),
		previous_users AS (
			SELECT
				guild,
				COUNT(DISTINCT "userId") as "previousParticipants"
			FROM
				"Entry" JOIN "User" ON "Entry"."userId" = "User"."telegramUserId"
			WHERE
				"Entry"."createdAt" < ${periodStart}
			GROUP BY
				guild
		)

		SELECT
			period_stats.guild,
			"pointsGainedInPeriod",
			"continuingParticipants",
			"previousParticipants"
		FROM
			period_stats LEFT JOIN previous_users ON period_stats.guild = previous_users.guild
	`) as PeriodStats[];

	const statistics = new Map<Guild, TeamStatistics>();

	for (const aggregate of aggregates) {
		const periodStat = periodStats.find(
			(stat) => stat.guild === aggregate.guild,
		);
		const milestoneAchievers = milestoneAchieversByGuild.find(
			(stat) => stat.guild === aggregate.guild,
		)?.milestoneAchievers;

		statistics.set(aggregate.guild, {
			totalPoints: aggregate.totalPoints,
			totalKilometers: aggregate.totalKilometers,
			totalEntries: Number(aggregate.totalEntries),
			numberOfUniqueParticipants: Number(aggregate.uniqueParticipants),
			proportionOfContinuingParticipants: Number(periodStat?.continuingParticipants) / Number(periodStat?.previousParticipants) || 0,
			pointsGainedInPeriod: Number(periodStat?.pointsGainedInPeriod) || 0,
			proportionOfMilestoneAchievers: Number(
				milestoneAchievers ? Number(milestoneAchievers) / Number(aggregate.uniqueParticipants) : 0
			),
		});
	}

	return statistics;
}
