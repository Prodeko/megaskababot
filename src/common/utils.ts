import _ from 'lodash'

import { INVALID_INPUT_STICKERS } from './constants'
import { Entry, User } from './types'

export const arrayToCSV = <T extends Record<string, unknown>>(
  headers: (keyof T)[],
  data: T[]
): string => {
  const dataRows = data.map(d => headers.map(h => d[h]))
  const array = [headers, ...dataRows]
  return array.map(t => t.join(';')).join('\n')
}

export const formatEntry = (e: Entry) => {
  const localeDateString =
    e?.createdAt.toLocaleString('fi-FI', {
      timeStyle: 'short',
      dateStyle: 'short',
      timeZone: 'EET',
    }) ?? 'Unknown date'
  const doublePointsString = e.doublePoints ? '\n2️⃣x' : ''
  return (
    `${localeDateString}
Distance: ${e.distance} km
Sport: ${e.sport}` + doublePointsString
  )
}

export const formatEntryWithUser = (e: Entry & { user: User }) => {
  const usernameLink = `<a href="tg://user?id=${e.userId}">@${e.user.telegramUsername}</a>`

  return `Username: ${usernameLink}
Entry #${e.id}
${formatEntry(e)}`
}

export const randomInvalidInputSticker = () => _.shuffle(INVALID_INPUT_STICKERS)[0]
