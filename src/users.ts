import { prisma } from "../config";
import type { User } from "./common/types";
import { isCompleteUser } from "./common/validators";

const users = new Map<number, Partial<User>>();

// TODO rename this
const isUser = async (userId: number) => {
	const user = await prisma.user.findUnique({
		where: { telegramUserId: userId },
	});
	return !!user;
};

const updateUsersStash = (userId: number, update: Partial<User>) => {
	users.set(userId, {
		...users.get(userId),
		...update,
	});
};

const getUserStash = (userId: number) => {
	return users.get(userId);
};

const userToDb = async (userId: number) => {
	const user = users.get(userId);
	if (!user || !isCompleteUser(user)) {
		console.log(user);
		throw new Error("User not complete");
	}

	await prisma.user.create({
		data: user,
	});
	users.delete(userId);
};

export { isUser, updateUsersStash, userToDb, getUserStash };
