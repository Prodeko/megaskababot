import * as fs from 'fs'

import { prisma } from '../config'
import { Entry, EntryWithUser } from './common/types'
import { arrayToCSV } from './common/utils'
import { isBigInteger, isCompleteEntry } from './common/validators'

const entries = new Map<number, Partial<Entry>>()

const updateEntryStash = (chatId: number, update: Partial<Entry>) => {
  entries.set(chatId, {
    ...entries.get(chatId),
    ...update,
  })
}

const getEntries = async (userId: unknown): Promise<Entry[]> => {
  if (!isBigInteger(userId)) {
    throw TypeError('userId should be a long')
  }
  return (await prisma.entry.findMany({
    where: { userId },
    orderBy: [
      {
        createdAt: 'asc',
      },
    ],
  })) as unknown as Entry[]
}

const getAllEntries = async () => {
  return await prisma.entry.findMany({ include: { user: true } })
}

const getRandomNotValidEntry = async () => {
  const entry = await prisma.entry.findFirst({
    where: {
      valid: null,
    },
    include: { user: true },
  })
  return entry
}

const getEntry = (id: number) =>
  prisma.entry.findUniqueOrThrow({ where: { id }, include: { user: true } })

const removeEntry = (id: number) =>
  prisma.entry.delete({
    where: {
      id,
    },
  })

const setEntryValidation = async (entryId: number, valid: boolean) => {
  await prisma.entry.update({ where: { id: entryId }, data: { valid } })
}

const setEntryDoublePoints = async (entryId: number, doublePoints: boolean) => {
  await prisma.entry.update({ where: { id: entryId }, data: { doublePoints } })
}

const removeLatest = async (userId: number) => {
  const latest = await prisma.entry.findFirst({
    select: { id: true },
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  if (!latest) return false

  await removeEntry(latest.id)

  return true
}

const amountToValidate = () => prisma.entry.count({ where: { valid: null } })

const entryToDb = async (chatId: number) => {
  const entry = entries.get(chatId)
  if (!entry || !isCompleteEntry(entry)) throw new Error('Entry is not complete!')

  await prisma.entry.create({
    data: entry,
  })
  entries.delete(chatId)
}

const fileIdsForUserId = async (userId: bigint) =>
  prisma.entry.findMany({ select: { fileId: true }, where: { userId } })

const fileIdsForUsername = async (username: string) => {
  const result = await prisma.user.findFirst({
    select: { telegramUserId: true },
    where: { telegramUsername: username },
  })

  if (result) {
    return await fileIdsForUserId(result.telegramUserId as unknown as bigint)
  } else {
    return null
  }
}

const updateEntry = (id: number, data: Partial<Entry>) =>
  prisma.entry.update({
    where: { id },
    data,
  })

const saveEntriesAsCSV = async () => {
  const entries = (await getAllEntries()) as unknown as EntryWithUser[]

  const headers = [
    {
      id: 'id',
      distance: 'distance',
      fileId: 'fileId',
      sport: 'sport',
      userId: 'userId',
      createdAt: 'createdAt',
      valid: 'valid',
      doublePoints: 'doublePoints',
      user: 'user',
      telegramUserId: 'telegramUserId',
      telegramUsername: 'telegramUsername',
      firstName: 'firstName',
      lastName: 'lastName',
      freshmanYear: 'freshmanYear',
      guild: 'guild',
    },
  ]
  const flattenedEntries = headers.concat(
    entries.map<any>(e => ({
      ...e,
      ...e.user,
      createdAt: e.createdAt,
      user: undefined,
    }))
  )
  const csv = arrayToCSV(flattenedEntries)
  fs.writeFileSync('entries.csv', csv)
}

export {
  updateEntryStash,
  entryToDb,
  getAllEntries,
  getEntries,
  getRandomNotValidEntry,
  setEntryValidation,
  setEntryDoublePoints,
  removeLatest,
  amountToValidate,
  getEntry,
  removeEntry,
  fileIdsForUserId,
  fileIdsForUsername,
  updateEntry,
  saveEntriesAsCSV,
}
