import { MegaskabaContext, MegaskabaConversation } from "../common/types.ts";
import {
  EXPECTED_IMAGE_MESSAGE,
  IMAGE_PROOF_MESSAGE,
} from "../common/constants.ts";

export async function image(
  conversation: MegaskabaConversation,
  ctx: MegaskabaContext,
): Promise<string> {
  await ctx.reply(IMAGE_PROOF_MESSAGE);

  let fileId: string | null = null;

  while (fileId === null) {
    const response = await conversation.waitFor("message");
    fileId = response.msg.photo?.[0]?.file_id ?? null;

    if (fileId === null) {
      await ctx.reply(EXPECTED_IMAGE_MESSAGE);
    }
  }

  return fileId;
}
