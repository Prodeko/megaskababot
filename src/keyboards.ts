import { Markup } from "telegraf"
import { GUILDS, YEARS, SPORTS } from "./common/constants"

export const guildKeyboard = Markup.keyboard(GUILDS).oneTime()
export const yearKeyboard = Markup.keyboard(YEARS).oneTime()
export const transpKeyboard = Markup.keyboard(SPORTS).oneTime().resize()
export const validationKeyboard = Markup.keyboard(['Valid', 'Invalid']).oneTime().resize() 
