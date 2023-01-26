import { GUILDS, TRANSP } from "./constants";
import { Guild, Transp } from "./types";

const isTransp = (transp: any): transp is Transp => {
    return typeof transp === 'string' && TRANSP.some(t => transp === t)
}

const isGuild = (guild: any): guild is Guild => {
    return typeof guild === 'string' && GUILDS.some(g => guild === g)
}

export {
    isTransp,
    isGuild
}