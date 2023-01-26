import { writeToDb } from "./db"
import { User } from "./types"

const users = new Map<number, Partial<User>>()

const isUser = (userId: number) => users.has(userId)

const updateUsersStash = (userId: number, update: Partial<User>) => {
    users.set(userId, {
        ...users.get(userId),
        ...update
    })
} 

const usersToDb = () => writeToDb('users_db.json', users)

export {
    isUser,
    updateUsersStash,
    usersToDb
}