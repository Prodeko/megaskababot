export type Phase = 'year' | 'guild' | 'dist' | 'proof' | 'transp'

export type Guild = 'prodeko' | 'athene' | 'fyysikkokilta'
export type Sport = "run/walk" | "ski"

export type UserWithoutTime = {
    telegramUserId:  number,
    telegramUsername: string,
    firstName: string,
    lastName: string,
    freshmanYear: number,
    guild: Guild
}

export type User = UserWithoutTime & {
    createdAt: Date
}


export type EntryWithoutId = {
    distance: number,
    fileId: string,
    sport: Sport,
    userId: number,
}

export type Entry = EntryWithoutId & {
    id: number,
}