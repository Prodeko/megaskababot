import { Markup } from 'telegraf'

import { GUILDS, SPORTS, VALIDATIONS, YEARS } from './common/constants'

export const guildKeyboard = Markup.keyboard(GUILDS).oneTime()
export const yearKeyboard = Markup.keyboard(YEARS).oneTime()
export const transpKeyboard = Markup.keyboard(SPORTS).oneTime().resize()
export const validationKeyboard = Markup.keyboard(VALIDATIONS)
  .oneTime()
  .resize()
