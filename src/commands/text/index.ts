
import { TextCtxType } from '../../common/types'
import { conversationPhase } from '../../common/variables'
import distance from './distance'
import guild from './guild'
import sport from './sport'
import year from './year'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const text = async (ctx: TextCtxType, next: () => Promise<void>) => {
  const chatId = ctx.chat.id
  const userId = ctx.update.message.from.id
  const text = ctx.update.message.text
  switch (conversationPhase.get(chatId)) {
    case 'year':
      await year(ctx, text, userId, chatId)
      break

    case 'guild':
      await guild(ctx, text, userId)
      break

    case 'sport':
      await sport(ctx, text, chatId)
      break

    case 'dist':
      await distance(ctx, text, chatId, userId)
      break
  }

  return next()
}

export default text
