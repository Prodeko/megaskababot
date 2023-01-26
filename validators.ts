import { GUILDS, SPORTS } from "./constants";
import { Entry, EntryWithoutId, Guild, Sport, User, UserWithoutTime } from "./types";

const isSport = (sport: any): sport is Sport => {
    return typeof sport === 'string' && SPORTS.some(t => sport === t)
}

const isGuild = (guild: any): guild is Guild => {
    return typeof guild === 'string' && GUILDS.some(g => guild === g)
}

const isCompleteUser = (user: Partial<User>): user is UserWithoutTime => {
    return typeof user?.telegramUserId === "number" && 
    typeof user?.telegramUsername === "string" &&
    typeof user?.firstName === "string" &&
    typeof user?.lastName === "string" &&
    typeof user?.freshmanYear === "number" &&
    typeof user?.guild === "string"
}

const isCompleteEntry = (entry: Partial<Entry>): entry is EntryWithoutId => {
    return typeof entry?.distance === "number" &&
    typeof entry?.fileId === "string" &&
    typeof entry?.userId === "number" &&
    isSport(entry?.sport)
}

export {
    isSport,
    isGuild,
    isCompleteUser,
    isCompleteEntry
}