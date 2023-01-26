import { GUILDS, SPORTS } from "./constants";
import { Guild, Sport } from "./types";

const isSport = (sport: any): sport is Sport => {
    return typeof sport === 'string' && SPORTS.some(t => sport === t)
}

const isGuild = (guild: any): guild is Guild => {
    return typeof guild === 'string' && GUILDS.some(g => guild === g)
}

export {
    isSport,
    isGuild
}