import { writeToDb } from "./db"
import { Entry, User } from "./types"
import { v4 } from 'uuid';
import { isCompleteEntry, isCompleteUser, isEntry } from "./validators";
import { prisma } from "./config";

const entries = new Map<number, Partial<Entry>>()
const entryIds = new Map()

const updateEntryStash = (chatId: number, update: Partial<Entry>) => {
    entries.set(chatId, {
        ...entries.get(chatId),
        ...update
    })
}

const getEntries = async (userId: number) => {
    return (await prisma.entry.findMany({where:{userId}})) as Entry[]
}

const getAllEntries = async () => {
    return (await prisma.entry.findMany({include: {user: true}}))
}

const getRandomEntry = async () => {
    const count = await prisma.entry.count({})
    const randomId = Math.ceil(Math.random() * count)
    const entry = await prisma.entry.findFirst({where: {id: randomId}, include: {user: true}})
    return entry
}

const entryToDb = async (chatId: number) => {
    const entry = entries.get(chatId)
    if(!entry || !isCompleteEntry(entry)) throw new Error("Entry is not complete!")

    await prisma.entry.create({
        data: entry
    })

}

export {
    updateEntryStash,
    entryToDb,
    getAllEntries,
    getEntries,
    getRandomEntry
}