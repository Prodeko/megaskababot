import { prisma } from './config'
import { Entry } from './types'
import { isCompleteEntry } from './validators'

const entries = new Map<number, Partial<Entry>>()

const updateEntryStash = (chatId: number, update: Partial<Entry>) => {
  entries.set(chatId, {
    ...entries.get(chatId),
    ...update,
  })
}

const getEntries = async (userId: number) => {
  return (await prisma.entry.findMany({ where: { userId } })) as Entry[]
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

  await prisma.entry.delete({
    where: {
      id: latest.id,
    },
  })

  return true
}

const entryToDb = async (chatId: number) => {
  const entry = entries.get(chatId)
  if (!entry || !isCompleteEntry(entry)) throw new Error('Entry is not complete!')

  await prisma.entry.create({
    data: entry,
  })
}

export {
  updateEntryStash,
  entryToDb,
  getAllEntries,
  getEntries,
  getRandomNotValidEntry,
  setEntryValidation,
  removeLatest,
}
