import { prisma } from "../../config";
import { MILESTONE_LIMIT } from "../common/constants";
import type { Guild, Statistics, TeamStatistics } from "../common/types";

interface PeriodStats {
	guild: Guild;
	pointsGainedInPeriod: number;
	continuingParticipants: number;
	proportionOfContinuingParticipants: number;
}

interface Aggregate {
	guild: Guild;
	totalPoints: number;
	totalKilometers: number;
	totalEntries: number;
	uniqueParticipants: number;
	proportionOfMilestoneAchievers: number;
}

// Function to calculate and return the total points
export async function calculateGuildStatistics(
	periodStart: Date,
	periodEnd: Date,
): Promise<Statistics> {
	const aggregates = (await prisma.$queryRaw`
		WITH base_satistics AS (
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
		)
		SELECT
			*,
			COUNT(
				CASE WHEN "totalPoints" >= ${MILESTONE_LIMIT} THEN 1 END
			)/"uniqueParticipants" as "proportionOfMilestoneAchievers"
		FROM
			base_satistics
		GROUP BY
			guild,
			"totalPoints",
			"totalKilometers",
			"totalEntries",
			"uniqueParticipants"
	`) as Aggregate[];

	const periodStats = (await prisma.$queryRaw`
		WITH period_stats AS (
			SELECT
				guild,
				SUM("earnedPoints") as "pointsGainedInPeriod",
				COUNT(DISTINCT user) as "continuingParticipants"
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
				COUNT(DISTINCT user) as "previousParticipants"
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
			CASE WHEN "previousParticipants" = 0 THEN 1 ELSE "continuingParticipants"/"previousParticipants" END as "proportionOfContinuingParticipants"
		FROM
			period_stats LEFT JOIN previous_users ON period_stats.guild = previous_users.guild
	`) as PeriodStats[];

	const statistics = new Map<Guild, TeamStatistics>();

	for (const aggregate of aggregates) {
		const periodStat = periodStats.find(
			(stat) => stat.guild === aggregate.guild,
		);
		console.log("aggreage", aggregate);
		statistics.set(aggregate.guild, {
			totalPoints: aggregate.totalPoints,
			totalKilometers: aggregate.totalKilometers,
			totalEntries: Number(aggregate.totalEntries),
			numberOfUniqueParticipants: Number(aggregate.uniqueParticipants),
			proportionOfContinuingParticipants:
				Number(periodStat?.proportionOfContinuingParticipants) || 0,
			pointsGainedInPeriod: Number(periodStat?.pointsGainedInPeriod) || 0,
			proportionOfMilestoneAchievers: Number(
				aggregate.proportionOfMilestoneAchievers,
			),
		});
	}

	return statistics;
}
