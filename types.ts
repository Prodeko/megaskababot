export type Phase = 'year' | 'guild' | 'dist' | 'proof' | 'transp'

export type Guild = 'prodeko' | 'athene' | 'fyysikkokilta'
export type Sport = "run/walk" | "ski"

export type User = {
    telegramUserId:  String,
    telegramUserName: String,
    firstName: string,
    lastName: string,
    freshmanYear: number,
    guild: Guild,
    createdAt: Date
}

export type EntryWithoutId = {
    distance: number,
    fileId: string,
    sport: Sport,
    userId: string,
}

export type Entry = EntryWithoutId & {
    id: number,
}