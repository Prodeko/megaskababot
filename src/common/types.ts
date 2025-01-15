import { Context, NarrowedContext } from "telegraf";
import type {
	CallbackQuery,
	Message,
	Update,
} from "telegraf/typings/core/types/typegram";
import type { GUILDS, SPORTS } from "./constants.ts";

export type Phase = "year" | "guild" | "dist" | "proof" | "sport";
type GuildTuple = typeof GUILDS;
export type Guild = GuildTuple[number];
// TODO split these to their own categories
type SportTuple = typeof SPORTS;
export type Sport = SportTuple[number];
export type Validation = "Valid" | "Invalid" | "Stop validation";

interface YearPhase {
	phase: "year";
	year: number;
}

interface GuildPhase {
	phase: "guild";
	year: number;
	guild: Guild;
}

interface SportPhase {
	phase: "sport";
	sport: Sport;
}

interface DistPhase {
	phase: "dist";
	sport: Sport;
	distance: number;
}

interface ProofPhase {
	phase: "proof";
	sport: Sport;
	distance: number;
	fileId: string;
}

export type State =
	| YearPhase
	| GuildPhase
	| SportPhase
	| DistPhase
	| ProofPhase;

export interface MegaskabaContext extends Context {
	session?: State;
}

export type UserWithoutTime = {
	telegramUserId: bigint;
	telegramUsername: string;
	firstName: string;
	lastName?: string;
	freshmanYear: number;
	guild: Guild;
};

export type User = UserWithoutTime & {
	createdAt: Date;
};

export type EntryWithoutId = {
	distance: number;
	fileId: string;
	sport: Sport;
	userId: number;
	doublePoints: boolean;
	earnedPoints: number;
	sportMultiplier: number;
};

export type Entry = EntryWithoutId & {
	id: number;
	createdAt: Date;
	valid: boolean | null;
};

export type EntryWithUser = Entry & { user: User };

export type CommandContext = NarrowedContext<
	Context<Update>,
	{
		message: Update.New & Update.NonChannel & Message.TextMessage;
		update_id: number;
	}
>;

export type ActionContext = NarrowedContext<
	Context<Update> & {
		match: RegExpExecArray;
	},
	Update.CallbackQueryUpdate<CallbackQuery>
>;

export type TextCtxType = NarrowedContext<
	Context<Update>,
	{
		message: Update.New & Update.NonChannel & Message.TextMessage;
		update_id: number;
	}
>;

export type PhotoCtxType = NarrowedContext<
	Context<Update>,
	{
		message: Update.New & Update.NonChannel & Message.PhotoMessage;
		update_id: number;
	}
>;

export type TeamStatistics = {
	totalPoints: number;
	totalKilometers: number;
	totalEntries: number;
	numberOfUniqueParticipants: number;
	proportionOfContinuingParticipants: number;
	pointsGainedInPeriod: number;
	proportionOfMilestoneAchievers: number;
};

export type Statistics = Map<Guild, TeamStatistics>;

export type pointsPerGuild = Map<Guild, number>;

export type PrivacyState = "accepted" | "rejected";
