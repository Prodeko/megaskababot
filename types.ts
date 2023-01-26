export type Phase = 'year' | 'guild' | 'dist' | 'proof' | 'transp'

export type Guild = 'prodeko' | 'athene' | 'fyysikkokilta'
export type Transp = "run/walk" | "ski"

export interface User {
    id:  number
    firstName: string,
    lastName: string,
    username: string,
    year: number,
    guild: Guild,
}

export interface Entry {
    id: number,
    userId: number,
    distance: number,
    transp: Transp,
    fileId: string,
}