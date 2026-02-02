import { ConversationContext, MegaskabaConversation } from "../common/types.ts";
import {
  EXPECTED_IMAGE_MESSAGE,
  IMAGE_PROOF_MESSAGE,
} from "../common/constants.ts";

export async function image(
  conversation: MegaskabaConversation,
  ctx: ConversationContext,
): Promise<string[]> {
  await ctx.reply(IMAGE_PROOF_MESSAGE);

  let fileIds: string | null = null;

  while (fileIds === null) {
    const response = await conversation.waitFor("msg");
    // TODO: Figure out how to actually capture multiple files.
    // Now we just grab the first size from some photo.
    fileIds = response?.msg?.photo?.map((p) => p.file_id).find(Boolean) ?? null;

    if (fileIds === null) {
      await ctx.reply(EXPECTED_IMAGE_MESSAGE);
    }
  }

  return [fileIds];
}
