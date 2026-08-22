import { z } from "zod";
import type { Message } from "@/types/chat";

/**
 * Message as returned by `POST /messages` and `GET /conversations/{id}/messages`:
 *
 * ```json
 * {
 *   "_id": "6a893879e5d6aac97527a6fe",
 *   "conversation": "6a892ec9e5d6aac975274785",
 *   "sender": "6a882468e5d6aac97521e25e",
 *   "text": "Project Team again",
 *   "createdAt": "2026-08-22T05:49:45.621Z"
 * }
 * ```
 *
 * Note the asymmetry: the request body names the field `conversationId`, the
 * response names the same thing `conversation`. Normalised to `conversationId`
 * here so only this file knows about it.
 *
 * `sender` and `conversation` are id strings, not embedded objects — sender names
 * are resolved against the conversation's participant list.
 */
const rawMessageSchema = z.object({
  _id: z.string().min(1).optional(),
  id: z.string().min(1).optional(),
  // Accept either name in case the list endpoint differs from the send response.
  conversation: z.string().optional(),
  conversationId: z.string().optional(),
  sender: z.string(),
  text: z.string(),
  createdAt: z.string(),
});

export const messageSchema = rawMessageSchema.transform((raw, ctx): Message => {
  const id = raw._id ?? raw.id;
  const conversationId = raw.conversation ?? raw.conversationId;

  if (!id) {
    ctx.addIssue({ code: "custom", message: "Message has neither `_id` nor `id`." });
    return z.NEVER;
  }
  if (!conversationId) {
    ctx.addIssue({
      code: "custom",
      message: "Message has neither `conversation` nor `conversationId`.",
    });
    return z.NEVER;
  }

  return {
    id,
    conversationId,
    senderId: raw.sender,
    text: raw.text,
    createdAt: raw.createdAt,
    status: "sent",
  };
});

/**
 * Pseudo-control messages that other clients on this shared API smuggle through
 * the `text` field.
 *
 * The database is shared between everyone doing this assignment, and several
 * implementations have built reactions and read-receipts by encoding JSON into a
 * normal message body:
 *
 *   @@SEEN:{"conversationId":"…"}
 *   @@REACT:{"messageId":"…","emoji":"❤️"}
 *   __PULSE_SIGNAL__{"type":"seen","conversationId":"…"}
 *
 * To this app they are not messages — they're another program's protocol leaking
 * into shared data, and rendering them would put visible garbage in the middle of
 * a conversation. They're filtered out of history.
 *
 * Kept deliberately narrow: anchored to these exact prefixes, so a real message
 * that merely happens to contain an @ or an underscore is never dropped.
 */
const CONTROL_MESSAGE_PATTERNS = [
  /^@@(?:SEEN|REACT|REACTION|TYPING|DELIVERED)\s*[:{]/i,
  /^__[A-Z_]+__\s*[{[]/,
];

export function isControlMessage(text: string): boolean {
  const trimmed = text.trimStart();
  return CONTROL_MESSAGE_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export interface MessageHistory {
  messages: Message[];
  /**
   * True when the server is holding older messages we haven't loaded.
   *
   * Surfaced rather than ignored: silently showing a truncated transcript as if it
   * were complete is a correctness problem, not a cosmetic one.
   */
  hasMore: boolean;
}

/**
 * Parses message history.
 *
 * ⚠️ This endpoint uses a **third** envelope convention — `{ messages, hasMore }`.
 * `/users/search` returns a bare array and `/conversations` returns
 * `{ data: [...] }`. All three are accepted here because there is no way to
 * predict which an endpoint will use, and guessing wrong yields an empty list
 * rather than an error — a silent failure that looks like "this chat has no
 * messages".
 *
 * Records are parsed one at a time, so one malformed message costs one bubble
 * instead of the whole thread.
 */
export function parseMessageHistory(payload: unknown): MessageHistory {
  let raw: unknown[] | null = null;
  let hasMore = false;

  if (Array.isArray(payload)) {
    raw = payload;
  } else if (payload && typeof payload === "object") {
    const record = payload as {
      messages?: unknown;
      data?: unknown;
      hasMore?: unknown;
    };

    if (Array.isArray(record.messages)) raw = record.messages;
    else if (Array.isArray(record.data)) raw = record.data;

    hasMore = record.hasMore === true;
  }

  if (!raw) return { messages: [], hasMore: false };

  const messages: Message[] = [];
  for (const item of raw) {
    const parsed = messageSchema.safeParse(item);
    if (!parsed.success) continue;
    if (isControlMessage(parsed.data.text)) continue;
    messages.push(parsed.data);
  }

  // The endpoint returns newest-first; a transcript reads oldest-first.
  messages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return { messages, hasMore };
}

/**
 * Parses the `POST /messages` response.
 *
 * ⚠️ The important case: **a rejected send answers with a `null` body**, not an
 * error status. Anything that treats a 2xx as success would leave the optimistic
 * bubble looking delivered when nothing was stored — the single worst failure mode
 * in a chat client, because the user believes they've been heard.
 *
 * Returning `null` here forces the caller to handle it.
 */
export function parseSentMessage(payload: unknown): Message | null {
  if (payload === null || payload === undefined) return null;

  const parsed = messageSchema.safeParse(payload);
  return parsed.success ? parsed.data : null;
}

/** Trimmed, non-empty message text. Empty messages must not be sendable. */
export const messageTextSchema = z
  .string()
  .transform((value) => value.trim())
  .refine((value) => value.length > 0, { message: "Message can't be empty." })
  .refine((value) => value.length <= 4_000, {
    message: "Message is too long.",
  });
