import { writeToDb } from "./db"
import { Entry, User } from "./types"
import { v4 } from 'uuid';
import { isCompleteEntry, isCompleteUser } from "./validators";
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
    return await prisma.entry.findMany({where:{userId}})
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
    getEntries  
}