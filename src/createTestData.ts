import { faker } from "@faker-js/faker";
import { GUILDS, YEARS, SPORTS, COEFFICIENTS } from "./common/constants";
import type { UserWithoutTime } from "./common/types";
import { prisma } from "../config";
import _ from "lodash";

//
// =====================================================================
//  FOR THIS TO WORK PROPERLY, YOU NEED TO REMOVE THE DEFAULT FROM ENTRY CREATED_AT FIELD
// =====================================================================
//

export const createFakeUser = (): UserWithoutTime => {
	const guild = GUILDS[Math.floor(Math.random() * GUILDS.length)];
	const freshmanYear = Number.parseInt(
		YEARS[Math.floor(Math.random() * YEARS.length)],
	);
	const telegramUsername = faker.internet.userName();
	const telegramUserId = faker.number.bigInt(); // Make sure this matches your Prisma model
	const firstName = faker.person.firstName(); // Note the change to use `name` instead of `person`
	const lastName = faker.person.lastName();

	return {
		telegramUserId,
		telegramUsername,
		guild,
		freshmanYear,
		firstName,
		lastName,
	};
};

const createFakeEentry = (userId: bigint) => {
	const sport = SPORTS[Math.floor(Math.random() * SPORTS.length)];
	const distance = faker.number.float({ min: 0.6, max: 100 });
	const sportMultiplier = COEFFICIENTS[sport];
	const earnedPoints = distance * sportMultiplier;
	const doublePoints = false;
	const fileId = "some-file-id";
	const createdAt = faker.date.between({
		from: "2024-05-02",
		to: "2024-05-31",
	});

	return {
		distance,
		fileId,
		sport,
		userId,
		doublePoints,
		earnedPoints,
		sportMultiplier,
		createdAt,
	};
};

const emptyDatabase = async () => {
	await prisma.entry.deleteMany();
	await prisma.user.deleteMany();
};

export const createTestData = async (n: number) => {
	if (process.env.NODE_ENV !== "development") {
		throw new Error("You can only run this in development environment");
	}
	await emptyDatabase();
	const users = Array.from({ length: n }, createFakeUser);
	await prisma.user.createMany({ data: users });
	const userIds = await prisma.user.findMany({
		select: { telegramUserId: true },
	});
	const entries = _.flatMap(userIds, (user) =>
		_.times(10, () => createFakeEentry(user.telegramUserId)),
	);
	await prisma.entry.createMany({ data: entries });
};

export default createTestData;
