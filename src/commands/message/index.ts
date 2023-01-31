import { conversationPhase } from '../../common/variables'
import distance from './distance'
import guild from './guild'
import proof from './proof'
import sport from './sport'
import year from './year'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const message = async (ctx: any, next: () => Promise<void>) => {
  const chatId = ctx.chat?.id
  const text = ctx.update.message?.text
  const userId = ctx.update.message.from.id

  switch (conversationPhase.get(chatId)) {
    case 'year':
      await year(ctx, text, userId, chatId)
      break

    case 'guild':
      await guild(ctx, text, userId, chatId)
      break

    case 'sport':
      await sport(ctx, text, chatId)
      break

    case 'dist':
      await distance(ctx, text, chatId, userId)
      break

    case 'proof':
      await proof(ctx, chatId)
      break
  }

  return next()
}

export default message