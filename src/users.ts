import { prisma } from "../prisma/client.ts";

export const checkIfUserHasRegistered = async (
  userId: number,
): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { telegramUserId: userId },
  });
  return !!user;
};
