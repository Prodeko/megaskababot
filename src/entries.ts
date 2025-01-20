import * as fs from "node:fs";

import { prisma } from "../prisma/client.ts";
import type { Entry, EntryWithUser } from "./common/types.ts";
import { arrayToCSV } from "./common/utils.ts";
import { isBigInteger, isCompleteEntry } from "./common/validators.ts";
import { COEFFICIENTS } from "./common/constants.ts";

const entries = new Map<number, Partial<Entry>>();

const updateEntryStash = (chatId: number, update: Partial<Entry>) => {
  entries.set(chatId, {
    ...entries.get(chatId),
    ...update,
  });
};

const getEntriesByUserId = async (userId: unknown): Promise<Entry[]> => {
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

const getEntriesByUsername = async (username: string): Promise<Entry[]> => {
  const result = await prisma.user.findFirst({
    select: { telegramUserId: true },
    where: { telegramUsername: username },
  });

  if (result) {
    return await getEntriesByUserId(result.telegramUserId);
  }
  return [];
};

const getAllEntries = async () => {
  return await prisma.entry.findMany({ include: { user: true } });
};

const getRandomNotValidEntry = async () => {
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

const getEntry = (id: number) =>
  prisma.entry.findUnique({ where: { id }, include: { user: true } });

const removeEntry = (id: number) =>
  prisma.entry.delete({
    where: {
      id,
    },
  });

const setEntryValidation = async (entryId: number, valid: boolean) => {
  await prisma.entry.update({ where: { id: entryId }, data: { valid } });
};

const setEntryDoublePoints = async (entryId: number, doublePoints: boolean) => {
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

const removeLatest = async (userId: number) => {
  const latest = await prisma.entry.findFirst({
    select: { id: true },
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!latest) return false;

  await removeEntry(latest.id);

  return true;
};

const amountToValidate = () => prisma.entry.count({ where: { valid: null } });

const entryToDb = async (chatId: number) => {
  const entry = entries.get(chatId);
  if (!entry || !isCompleteEntry(entry)) {
    throw new Error("Entry is not complete!");
  }

  const sportMultiplier = COEFFICIENTS[entry.sport];

  await prisma.entry.create({
    data: {
      ...entry,
      sportMultiplier,
      earnedPoints: entry.distance *
        sportMultiplier *
        (entry.doublePoints ?? false ? 2 : 1),
    },
  });
  entries.delete(chatId);
};

const fileIdsForUserId = (userId: bigint) =>
  prisma.entry.findMany({ select: { fileId: true }, where: { userId } });

const fileIdsForUsername = async (username: string) => {
  const result = await prisma.user.findFirst({
    select: { telegramUserId: true },
    where: { telegramUsername: username },
  });

  if (result) {
    return await fileIdsForUserId(result.telegramUserId as unknown as bigint);
  }
  return null;
};

const updateEntry = (id: number, data: Partial<Entry>) =>
  prisma.entry.update({
    where: { id },
    data,
  });

const saveEntriesAsCSV = async () => {
  const entries = (await getAllEntries()) as unknown as EntryWithUser[];

  const headers = [
    "id",
    "distance",
    "fileId",
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

export {
  amountToValidate,
  entryToDb,
  fileIdsForUserId,
  fileIdsForUsername,
  getAllEntries,
  getEntriesByUserId,
  getEntriesByUsername,
  getEntry,
  getRandomNotValidEntry,
  removeEntry,
  removeLatest,
  saveEntriesAsCSV,
  setEntryDoublePoints,
  setEntryValidation,
  updateEntry,
  updateEntryStash,
};
