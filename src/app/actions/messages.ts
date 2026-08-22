"use server";

import { revalidatePath } from "next/cache";
import { createApiClient, actionError, type ActionResult } from "./http";
import { messageTextSchema, parseSentMessage } from "@/lib/validation/message";
import { ROUTES } from "@/lib/routes";
import type { Message } from "@/types/chat";

/**
 * `POST /messages` — send to a direct chat or a group (same endpoint for both).
 *
 * ⚠️ The critical behaviour: **a rejected send returns a `null` body with a success
 * status**, not an error. Axios won't throw, so the obvious implementation would
 * report the message as delivered when nothing was stored — the worst failure a
 * chat client can have, because it's silent and happens exactly when the user has
 * stopped watching.
 *
 * `parseSentMessage` returns `null` for that case and it's converted into an
 * explicit failure here, so the UI can mark the bubble undelivered and keep the
 * user's text on screen.
 */
export async function sendMessage(
  conversationId: string,
  text: string,
): Promise<ActionResult<Message>> {
  // Same schema the composer uses, so the disabled send button and the real gate
  // can't drift apart. Whitespace-only counts as empty.
  const validated = messageTextSchema.safeParse(text);
  if (!validated.success) {
    return {
      ok: false,
      message: validated.error.issues[0]?.message ?? "Message can't be empty.",
      code: "VALIDATION",
    };
  }

  try {
    const api = await createApiClient();
    const { data } = await api.post("/messages", {
      conversationId,
      text: validated.data,
    });

    const message = parseSentMessage(data);

    if (!message) {
      return {
        ok: false,
        message: "The server didn't accept the message.",
        code: "SEND_REJECTED",
      };
    }

    // Refresh the thread and the sidebar, whose ordering and last-message preview
    // both just changed.
    revalidatePath(`${ROUTES.chat}/${conversationId}`);
    revalidatePath(ROUTES.chat, "layout");

    return { ok: true, data: message };
  } catch (error) {
    return actionError(error, "Couldn't send that message.");
  }
}
