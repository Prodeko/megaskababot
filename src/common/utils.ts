import { Entry, User } from './types'

export const arrayToCSV = <T extends { [k: string]: unknown }>(
  array: T[]
): string => {
  return array.map(t => Object.values(t).join(';')).join('\n')
}

export const formatEntry = (e: Entry) =>
  `Entry ${e.id} at ${e?.createdAt.toLocaleString('fi-FI')} \nDistance: ${e.distance} \nSport: ${
    e.sport
  }`

export const formatEntryWithUser = (e: Entry & { user: User }) =>
  `Username: <a href="tg://user?id=${e.userId}">@${e.user.telegramUsername}</a>\n` + formatEntry(e)
