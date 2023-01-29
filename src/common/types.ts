<<<<<<< HEAD
import { NarrowedContext, Context, Middleware } from "telegraf"
=======
import { NarrowedContext, Context } from "telegraf"
>>>>>>> 9f1b260 (Force user to accept privacy policy to start)
import { Update, Message, CallbackQuery } from "telegraf/typings/core/types/typegram"

export type Phase = 'year' | 'guild' | 'dist' | 'proof' | 'transp'

export type Guild = 'prodeko' | 'athene' | 'fyysikkokilta' | 'tietokilta'
export type Sport = 'run/walk' | 'ski'
export type Validation = 'Valid' | 'Invalid' | 'Stop validation'

export type UserWithoutTime = {
  telegramUserId: number
  telegramUsername: string
  firstName: string
  lastName: string
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

export type CommandContext = NarrowedContext<Context<Update>, {
  message: Update.New & Update.NonChannel & Message.TextMessage;
  update_id: number;
}>

export type ActionContext = NarrowedContext<Context<Update> & {
  match: RegExpExecArray;
}, Update.CallbackQueryUpdate<CallbackQuery>>


export type PrivacyState = 'accepted' | 'rejected'
