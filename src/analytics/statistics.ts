import { prisma } from "../../config";
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
	numberOfUniqueParticipants: number;
	milestoneAchievers: number;
	proportionOfMilestoneAchievers: number;
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
			COUNT(DISTINCT "userId") as "numberOfUniqueParticipants",
			COUNT(CASE WHEN "earnedPoints" >= 50 THEN 1 END)/COUNT(DISTINCT "userId") as "proportionOfMilestoneAchievers"
		FROM
			"Entry" JOIN "User" ON "Entry"."userId" = "User"."telegramUserId"
		GROUP BY
			guild
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

	const entriesInPeriod = await prisma.entry.findMany({
		where: {
			createdAt: {
				gte: periodStart,
				lte: periodEnd,
			},
		},
	});

	const previousUsers = (await prisma.$queryRaw`
			SELECT
				guild,
				COUNT(DISTINCT user) as "previousParticipants"
			FROM
				"Entry" JOIN "User" ON "Entry"."userId" = "User"."telegramUserId"
			WHERE
				"Entry"."createdAt" < ${periodStart}
			GROUP BY
				guild
	`) as { guild: Guild; previousParticipants: number }[];

	console.log(entriesInPeriod);
	const statistics = new Map<Guild, TeamStatistics>();

	for (const aggregate of aggregates) {
		const periodStat = periodStats.find(
			(stat) => stat.guild === aggregate.guild,
		);
		console.log("period", periodStats);
		statistics.set(aggregate.guild, {
			totalPoints: aggregate.totalPoints,
			totalKilometers: aggregate.totalKilometers,
			totalEntries: Number(aggregate.totalEntries),
			numberOfUniqueParticipants: Number(aggregate.numberOfUniqueParticipants),
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
