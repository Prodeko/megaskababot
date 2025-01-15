import { GUILDS, SPORTS } from "./constants.js.ts";
import type {
  Entry,
  EntryWithoutId,
  Guild,
  Sport,
  User,
  UserWithoutTime,
} from "./types.js.ts";

const isSport = (sport: unknown): sport is Sport => {
  return typeof sport === "string" && SPORTS.some((t) => sport === t);
};

const isGuild = (guild: unknown): guild is Guild => {
  return typeof guild === "string" && GUILDS.some((g) => guild === g);
};

const isCompleteUser = (user: Partial<User>): user is UserWithoutTime => {
  return (
    typeof user?.telegramUserId === "number" &&
    typeof user?.telegramUsername === "string" &&
    typeof user?.firstName === "string" &&
    (user.lastName === undefined || typeof user?.lastName === "string") &&
    typeof user?.freshmanYear === "number" &&
    typeof user?.guild === "string"
  );
};

const isCompleteEntry = (entry: Partial<Entry>): entry is EntryWithoutId => {
  return (
    typeof entry?.distance === "number" &&
    typeof entry?.fileId === "string" &&
    typeof entry?.userId === "number" &&
    isSport(entry?.sport)
  );
};

// deno-lint-ignore no-explicit-any
const isEntry = (entry: any): entry is Entry => {
  return (
    typeof entry?.distance === "number" &&
    typeof entry?.fileId === "string" &&
    typeof entry?.userId === "bigint" &&
    typeof entry?.id === "number" &&
    typeof entry?.createdAt === "object" &&
    isSport(entry?.sport)
  );
};

const isBigInteger = (number: unknown): number is bigint => {
  return typeof number === "bigint" || Number.isInteger(number);
};

export {
  isBigInteger,
  isCompleteEntry,
  isCompleteUser,
  isEntry,
  isGuild,
  isSport,
};
