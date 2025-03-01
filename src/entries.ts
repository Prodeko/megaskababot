import * as fs from "node:fs";

import { prisma } from "../prisma/client.ts";
import type { CreateEntry, Entry, EntryWithUser } from "./common/types.ts";
import { arrayToCSV } from "./common/utils.ts";
import { isBigInteger, isCompleteEntry } from "./common/validators.ts";
import { COEFFICIENTS } from "./common/constants.ts";

export const getEntriesByUserId = async (userId: unknown): Promise<Entry[]> => {
  if (!isBigInteger(userId)) {
    throw TypeError("userId should be a long");
  }
  return (await prisma.entry.findMany({
    where: { userId },
    orderBy: [
      {
        createdAt: "asc",
      },
    ],
  })) as unknown as Entry[];
};

export const getEntriesByUsername = async (
  username: string,
): Promise<Entry[]> => {
  const result = await prisma.user.findFirst({
    select: { telegramUserId: true },
    where: { telegramUsername: username },
  });

  if (result) {
    return await getEntriesByUserId(result.telegramUserId);
  }
  return [];
};

export const getAllEntries = async () => {
  return await prisma.entry.findMany({ include: { user: true } });
};

export const getRandomNotValidEntry = async () => {
  const count = await amountToValidate();
  if (count === 0) return null;
  const random = Math.floor(Math.random() * count);
  console.log("Random", random);

  const entry = await prisma.entry.findFirst({
    where: {
      valid: null,
    },
    skip: random,
    include: { user: true },
  });
  return entry;
};

export const getEntry = (id: number) =>
  prisma.entry.findUnique({ where: { id }, include: { user: true } });

export const removeEntry = (id: number) =>
  prisma.entry.delete({
    where: {
      id,
    },
  });

export const setEntryValidation = async (entryId: number, valid: boolean) => {
  await prisma.entry.update({ where: { id: entryId }, data: { valid } });
};

export const setEntryDoublePoints = async (
  entryId: number,
  doublePoints: boolean,
) => {
  const oldEntry = await prisma.entry.findUniqueOrThrow({
    where: { id: entryId },
  });
  await prisma.entry.update({
    where: { id: entryId },
    data: {
      doublePoints,
      earnedPoints: oldEntry.distance * oldEntry.sportMultiplier *
        (doublePoints ? 2 : 1),
    },
  });
};

export const removeLatest = async (userId: number) => {
  const latest = await prisma.entry.findFirst({
    select: { id: true },
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!latest) return false;

  await removeEntry(latest.id);

  return true;
};

export const amountToValidate = () =>
  prisma.entry.count({ where: { valid: null } });

/**
 * Creates a new entry in the DB
 * @param entry An new Entry to be created in the DB
 * @returns Created Entry
 */
export async function saveEntry(entry: CreateEntry): Promise<Entry> {
  const sportMultiplier = COEFFICIENTS[entry.sport];

  return await prisma.entry.create({
    data: {
      ...entry,
      sportMultiplier,
      earnedPoints: entry.distance *
        sportMultiplier *
        (entry.doublePoints ?? false ? 2 : 1),
    },
    // TODO: Save sports as enum in Prisma schema to avoid this horrible type cast
  }) as unknown as Entry;
}

export const fileIdsForUserId = async (userId: bigint) => {
  const foundEntries = await prisma.entry.findMany({
    where: { userId },
    select: { fileIds: true },
  });

  return foundEntries.flatMap((i) => i.fileIds);
};

export const fileIdsForUsername = async (username: string) => {
  const result = await prisma.user.findFirst({
    select: { telegramUserId: true },
    where: { telegramUsername: username },
  });

  if (result) {
    return await fileIdsForUserId(result.telegramUserId as unknown as bigint);
  } else {
    return null;
  }
};

export const updateEntry = (id: number, data: Partial<Entry>) =>
  prisma.entry.update({
    where: { id },
    data,
  });

export const saveEntriesAsCSV = async () => {
  const entries = (await getAllEntries()) as unknown as EntryWithUser[];

  const headers = [
    "id",
    "distance",
    "fileIds",
    "sport",
    "userId",
    "createdAt",
    "valid",
    "doublePoints",
    "user",
    "telegramUserId",
    "telegramUsername",
    "firstName",
    "lastName",
    "freshmanYear",
    "guild",
  ];

  const flattenedEntries = entries.map<Record<string, unknown>>((e) => ({
    ...e,
    ...e.user,
    createdAt: e.createdAt,
    user: undefined,
  }));

  const csv = arrayToCSV(headers, flattenedEntries);
  fs.writeFileSync("entries.csv", csv);
};
