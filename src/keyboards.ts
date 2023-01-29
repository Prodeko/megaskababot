import { Markup } from 'telegraf'

import { GUILDS, SPORTS, VALIDATIONS, YEARS } from './common/constants'

export const inlinePrivacyKeyboard = Markup.inlineKeyboard([
  [{ text: "Accept ✅", callback_data: "accepted" }, { text: "Reject ❌", callback_data: "rejected" }]
])

export const guildKeyboard = Markup.keyboard(GUILDS).oneTime()
export const yearKeyboard = Markup.keyboard(YEARS).oneTime()
export const transpKeyboard = Markup.keyboard(SPORTS).oneTime().resize()
export const validationKeyboard = Markup.keyboard(VALIDATIONS).oneTime().resize()
export const confirmationKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('Remove', 'remove'),
  Markup.button.callback('Cancel', 'cancel'),
])
