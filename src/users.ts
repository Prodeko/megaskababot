import { prisma } from "../prisma/client.ts";
import type { User } from "./common/types.ts";
import { isCompleteUser } from "./common/validators.ts";

const users = new Map<number, Partial<User>>();

export const checkIfUserHasRegistered = async (
  userId: number,
): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { telegramUserId: userId },
  });
  return !!user;
};

export const userToDb = async (userId: number) => {
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
