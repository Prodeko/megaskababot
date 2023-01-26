import { writeToDb } from "./db"
import { Entry, User } from "./types"
import { v4 } from 'uuid';

const entries = new Map<number, Partial<Entry>>()
const entryIds = new Map()

const initEntryId = (chatId: number) => {
    entryIds.set(chatId, v4())
}

const updateEntryStash = (chatId: number, update: Partial<Entry>) => {
    const entryId = entryIds.get(chatId)
    entries.set(entryId, {
        ...entries.get(entryId),
        ...update
    })
} 

const entriesToDb = () => writeToDb('entries_db.json', entries)

export {
    initEntryId,
    updateEntryStash,
    entriesToDb
}