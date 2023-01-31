import { GUILDS, SPORTS } from './constants'
import { Entry, EntryWithoutId, Guild, Sport, User, UserWithoutTime } from './types'

const isSport = (sport: unknown): sport is Sport => {
  return typeof sport === 'string' && SPORTS.some(t => sport === t)
}

const isGuild = (guild: unknown): guild is Guild => {
  return typeof guild === 'string' && GUILDS.some(g => guild === g)
}

const isCompleteUser = (user: Partial<User>): user is UserWithoutTime => {
  return (
    typeof user?.telegramUserId === 'number' &&
    typeof user?.telegramUsername === 'string' &&
    typeof user?.firstName === 'string' &&
    (user.lastName === undefined || typeof user?.lastName === 'string') &&
    typeof user?.freshmanYear === 'number' &&
    typeof user?.guild === 'string'
  )
}

const isCompleteEntry = (entry: Partial<Entry>): entry is EntryWithoutId => {
  return (
    typeof entry?.distance === 'number' &&
    typeof entry?.fileId === 'string' &&
    typeof entry?.userId === 'number' &&
    isSport(entry?.sport)
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntry = (entry: any): entry is Entry => {
  return (
    typeof entry?.distance === 'number' &&
    typeof entry?.fileId === 'string' &&
    typeof entry?.userId === 'number' &&
    typeof entry?.id === 'number' &&
    typeof entry?.createdAt === 'object' &&
    isSport(entry?.sport)
  )
}

const isBigInteger = (number: unknown): number is bigint => {
  return Number.isInteger(number)
}

export { isSport, isGuild, isCompleteUser, isCompleteEntry, isEntry, isBigInteger }
