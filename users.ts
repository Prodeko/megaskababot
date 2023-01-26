import { prisma } from "./config"
import { writeToDb } from "./db"
import { User } from "./types"
import { isCompleteUser } from "./validators"

const users = new Map<number, Partial<User>>()

const isUser = async (userId: number) => {
    const user = await prisma.user.findUnique({where: {telegramUserId: userId}})
    return !!user
}

const updateUsersStash = (userId: number, update: Partial<User>) => {
    users.set(userId, {
        ...users.get(userId),
        ...update
    })
} 

const userToDb = async (userId: number) => {
    const user = users.get(userId)
    if (!user || !isCompleteUser(user)){
        console.log(user)
        throw new Error("User not complete")
    } 

    await prisma.user.create({
        data: user
    })
}

export {
    isUser,
    updateUsersStash,
    userToDb
}