import { Context, NarrowedContext } from 'telegraf'
import { CallbackQuery, Message, Update } from 'telegraf/typings/core/types/typegram'

export type Phase = 'year' | 'guild' | 'dist' | 'proof' | 'sport'
export type Guild = 'prodeko' | 'athene' | 'fyysikkokilta' | 'tietokilta' | 'data guild'
export type Sport = 'run/walk' | 'ski' | 'skate'
export type Validation = 'Valid' | 'Invalid' | 'Stop validation'

export type UserWithoutTime = {
  telegramUserId: bigint
  telegramUsername: string
  firstName: string
  lastName?: string
  freshmanYear: number
  guild: Guild
}

export type User = UserWithoutTime & {
  createdAt: Date
}

export type EntryWithoutId = {
  distance: number
  fileId: string
  sport: Sport
  userId: number
}

export type Entry = EntryWithoutId & {
  id: number
  createdAt: Date
  valid: boolean
}

export type EntryWithUser = Entry & { user: User }

export type CommandContext = NarrowedContext<
  Context<Update>,
  {
    message: Update.New & Update.NonChannel & Message.TextMessage
    update_id: number
  }
>

export type ActionContext = NarrowedContext<
  Context<Update> & {
    match: RegExpExecArray
  },
  Update.CallbackQueryUpdate<CallbackQuery>
>

export type TextCtxType = NarrowedContext<
  Context<Update>,
  { message: Update.New & Update.NonChannel & Message.TextMessage; update_id: number }
>

export type PhotoCtxType = NarrowedContext<Context<Update>, {
  message: Update.New & Update.NonChannel & Message.PhotoMessage;
  update_id: number;
}>

export type PrivacyState = 'accepted' | 'rejected'
