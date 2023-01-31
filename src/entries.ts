import { isBigIntLiteral } from 'typescript'
import { prisma } from '../config'
import { Entry } from './common/types'
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
    throw TypeError("userId should be a long")
  }
  return (await prisma.entry.findMany({ where: { userId } })) as unknown as Entry[]
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
    return await fileIdsForUserId(result.telegramUserId)
  } else {
    return null
  }

}
export {
  updateEntryStash,
  entryToDb,
  getAllEntries,
  getEntries,
  getRandomNotValidEntry,
  setEntryValidation,
  removeLatest,
  amountToValidate,
  getEntry,
  removeEntry,
  fileIdsForUserId,
  fileIdsForUsername,
}
