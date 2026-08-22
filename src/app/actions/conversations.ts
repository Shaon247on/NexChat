"use server";

import { revalidatePath } from "next/cache";
import { createApiClient, actionError, type ActionResult } from "./http";
import { createdConversationSchema, conversationSchema } from "@/lib/validation/conversation";
import { createGroupInputSchema } from "@/lib/validation/group";
import { groupNameSchema } from "@/lib/validation/group";
import { ROUTES } from "@/lib/routes";

/**
 * Conversation and group mutations.
 *
 * Each one revalidates `/chat` as a layout, which re-runs the Server Component
 * that fetches the conversation list — that's how the sidebar updates without any
 * client-side cache to keep in sync.
 *
 * Failures are returned, not thrown: an uncaught throw in a Server Action gets
 * replaced with a generic message in production, which would discard exactly the
 * detail the UI needs to explain itself.
 */

function revalidateChat(conversationId?: string) {
  revalidatePath(ROUTES.chat, "layout");
  if (conversationId) revalidatePath(`${ROUTES.chat}/${conversationId}`);
}

/**
 * `POST /conversations` — start a direct chat.
 *
 * Callers should check for an existing direct conversation first: this endpoint
 * returns success whether it created one or matched an existing one, with nothing
 * in the response to tell them apart. Its response is also a reduced shape, so only
 * the id is taken.
 */
export async function startDirectConversation(
  userId: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    const api = await createApiClient();
    const { data } = await api.post("/conversations", { userId });

    const parsed = createdConversationSchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false, message: "The server returned an unexpected conversation.", code: "PARSE" };
    }

    revalidateChat(parsed.data.id);
    return { ok: true, data: parsed.data };
  } catch (error) {
    return actionError(error, "Couldn't start that conversation.");
  }
}

/** `POST /conversations/group` — needs a name and at least two other participants. */
export async function createGroup(input: {
  name: string;
  participantIds: string[];
}): Promise<ActionResult<{ id: string }>> {
  const validated = createGroupInputSchema.safeParse(input);
  if (!validated.success) {
    return {
      ok: false,
      message: validated.error.issues[0]?.message ?? "Check the group details.",
      code: "VALIDATION",
    };
  }

  try {
    const api = await createApiClient();
    const { data } = await api.post("/conversations/group", validated.data);

    // Unlike the direct endpoint, this returns a full group object.
    const parsed = conversationSchema.safeParse(data);
    const id = parsed.success
      ? parsed.data.id
      : createdConversationSchema.safeParse(data).data?.id;

    if (!id) {
      return { ok: false, message: "The group was created but couldn't be opened.", code: "PARSE" };
    }

    revalidateChat(id);
    return { ok: true, data: { id } };
  } catch (error) {
    return actionError(error, "Couldn't create the group.");
  }
}

/** `PATCH /conversations/{id}` — rename. Admins only, enforced by the API. */
export async function renameGroup(
  conversationId: string,
  name: string,
): Promise<ActionResult> {
  const validated = groupNameSchema.safeParse(name);
  if (!validated.success) {
    return {
      ok: false,
      message: validated.error.issues[0]?.message ?? "Enter a valid name.",
      code: "VALIDATION",
    };
  }

  try {
    const api = await createApiClient();
    await api.patch(`/conversations/${conversationId}`, { name: validated.data });
    revalidateChat(conversationId);
    return { ok: true, data: null };
  } catch (error) {
    return actionError(error, "Couldn't rename the group.");
  }
}

/**
 * `POST /conversations/{id}/participants` — add members.
 *
 * The API does not detect that someone is already in the group, so a duplicate add
 * succeeds silently. `alreadyIn` is passed by the caller (which knows the current
 * roster) and filtered here, so a duplicate request is never sent even if the
 * picker is bypassed.
 */
export async function addParticipants(
  conversationId: string,
  userIds: string[],
  alreadyIn: string[] = [],
): Promise<ActionResult> {
  const existing = new Set(alreadyIn);
  const fresh = userIds.filter((id) => !existing.has(id));

  if (fresh.length === 0) {
    return {
      ok: false,
      message: "Everyone selected is already in this group.",
      code: "CONFLICT",
    };
  }

  try {
    const api = await createApiClient();
    await api.post(`/conversations/${conversationId}/participants`, {
      userIds: fresh,
    });
    revalidateChat(conversationId);
    return { ok: true, data: null };
  } catch (error) {
    return actionError(error, "Couldn't add those members.");
  }
}

/**
 * `DELETE /conversations/{id}/participants/{userId}` — remove a member, or leave by
 * passing your own id. The endpoint can't distinguish the two intents, so the
 * caller says which it meant and the UI reacts accordingly.
 */
export async function removeParticipant(
  conversationId: string,
  userId: string,
): Promise<ActionResult> {
  try {
    const api = await createApiClient();
    await api.delete(`/conversations/${conversationId}/participants/${userId}`);
    revalidateChat(conversationId);
    return { ok: true, data: null };
  } catch (error) {
    return actionError(error, "Couldn't update the group members.");
  }
}

/** `POST /conversations/{id}/admins` — promote a member to admin. */
export async function promoteToAdmin(
  conversationId: string,
  userId: string,
): Promise<ActionResult> {
  try {
    const api = await createApiClient();
    await api.post(`/conversations/${conversationId}/admins`, { userId });
    revalidateChat(conversationId);
    return { ok: true, data: null };
  } catch (error) {
    return actionError(error, "Couldn't promote that member.");
  }
}
