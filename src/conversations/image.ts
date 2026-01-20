import { MegaskabaContext, MegaskabaConversation } from "../common/types.ts";
import {
  EXPECTED_IMAGE_MESSAGE,
  IMAGE_PROOF_MESSAGE,
} from "../common/constants.ts";

export async function images(
  conversation: MegaskabaConversation,
  ctx: MegaskabaContext,
): Promise<{ fileIds: string[]; captions: string[] }> {
  await ctx.reply(IMAGE_PROOF_MESSAGE);

  let collectedFileIds: string[] = [];
  let collectedCaptions: string[] = [];

  // Wait for at least one photo
  let firstMessage = await conversation.waitFor("msg");

  if (!firstMessage?.msg?.photo?.length) {
    await ctx.reply(EXPECTED_IMAGE_MESSAGE);
    return images(conversation, ctx); // Retry
  }

  const mediaGroupId = firstMessage.msg.media_group_id;

  if (mediaGroupId) {
    // It's an album: collect all messages in this media group
    collectedFileIds.push(
      firstMessage.msg.photo.at(-1)!.file_id // highest resolution
    );
    collectedCaptions.push(firstMessage.msg.caption ?? "");

    let collecting = true;
    while (collecting) {
      const msg = await conversation.waitFor("msg");
      if (msg.msg.media_group_id === mediaGroupId) {
        collectedFileIds.push(msg.msg.photo.at(-1)!.file_id);
        collectedCaptions.push(msg.msg.caption ?? "");
      } else {
        // This message is from another group, stop collecting
        await ctx.reply(EXPECTED_IMAGE_MESSAGE); 
        collecting = false; 
      }
    }
  } else {
    // Single photo
    collectedFileIds.push(firstMessage.msg.photo.at(-1)!.file_id);
    collectedCaptions.push(firstMessage.msg.caption ?? "");
  }

  return { fileIds: collectedFileIds, captions: collectedCaptions };
}