import { z } from "zod";
import { apiUserSchema } from "./user";
import type {
  Conversation,
  LastMessagePreview,
} from "@/types/chat";

/**
 * `lastMessage` is `{}` — not `null` — when a conversation has no messages.
 *
 * That's the dangerous shape: every field is optional in practice, so a naive
 * schema passes and `lastMessage.text` is silently `undefined` downstream. Every
 * field is therefore optional here and the transform collapses anything
 * incomplete to `null`, so "no messages yet" is a state the UI cannot miss.
 */
const rawLastMessageSchema = z
  .object({
    text: z.string().optional(),
    sender: z.string().optional(),
    createdAt: z.string().optional(),
  })
  .nullish();

function toLastMessage(
  raw: z.infer<typeof rawLastMessageSchema>,
): LastMessagePreview | null {
  if (!raw?.text || !raw.sender || !raw.createdAt) return null;
  return { text: raw.text, senderId: raw.sender, createdAt: raw.createdAt };
}

const rawDirectConversationSchema = z.object({
  _id: z.string().min(1),
  type: z.literal("direct"),
  updatedAt: z.string(),
  lastMessage: rawLastMessageSchema,
  // Optional: a direct conversation with a since-deleted counterpart has been
  // observed without one, and losing the whole list over that would be worse.
  participant: apiUserSchema.optional(),
});

const rawGroupConversationSchema = z.object({
  _id: z.string().min(1),
  type: z.literal("group"),
  updatedAt: z.string(),
  lastMessage: rawLastMessageSchema,
  name: z.string(),
  createdBy: z.string(),
  // Ids only, not user objects.
  admins: z.array(z.string()).default([]),
  participants: z.array(apiUserSchema).default([]),
});

/**
 * Direct and group conversations are genuinely different records, not one shape
 * with optional fields — direct has a singular `participant` and no name, group
 * has `name`/`createdBy`/`admins`/`participants`. Modelling that as a
 * discriminated union means TypeScript enforces the branch instead of leaving a
 * pile of optional properties for each component to re-check.
 */
const rawConversationSchema = z.discriminatedUnion("type", [
  rawDirectConversationSchema,
  rawGroupConversationSchema,
]);

export const conversationSchema = rawConversationSchema.transform(
  (raw): Conversation => {
    if (raw.type === "direct") {
      return {
        id: raw._id,
        type: "direct",
        updatedAt: raw.updatedAt,
        lastMessage: toLastMessage(raw.lastMessage),
        participant: raw.participant,
      };
    }

    return {
      id: raw._id,
      type: "group",
      updatedAt: raw.updatedAt,
      lastMessage: toLastMessage(raw.lastMessage),
      name: raw.name,
      createdById: raw.createdBy,
      adminIds: raw.admins,
      participants: raw.participants,
    };
  },
);

/**
 * `POST /conversations` (start a direct chat) returns a **different shape** from
 * every other conversation response:
 *
 * ```json
 * { "_id": "…", "participants": ["<meId>", "<themId>"], "createdAt": "…" }
 * ```
 *
 * `participants` here is an array of **id strings**, not user objects, and there's
 * no `type`, no `updatedAt`, and no `participant`. So it can't be parsed as a
 * `Conversation` — the only durable thing in it is the id, which is all we need:
 * navigate to the thread and let the list refetch supply the real record.
 *
 * `POST /conversations/group` does return a full group object, so that one uses
 * `conversationSchema`.
 */
export const createdConversationSchema = z
  .object({
    _id: z.string().min(1).optional(),
    id: z.string().min(1).optional(),
  })
  .transform((raw, ctx) => {
    const id = raw._id ?? raw.id;
    if (!id) {
      ctx.addIssue({
        code: "custom",
        message: "Created conversation has no id.",
      });
      return z.NEVER;
    }
    return { id };
  });

export interface ConversationListResult {
  conversations: Conversation[];
  /**
   * Records that failed validation. Surfaced rather than hidden so a shape change
   * upstream is visible instead of quietly shortening the list.
   */
  skipped: number;
}

/**
 * Parses the conversation list **item by item**, tolerating bad records.
 *
 * This is deliberate. `/conversations` returns everything in one payload with no
 * pagination, and the live dataset is messy — one record has `name` and `phone`
 * swapped, several have unparseable phone values. With a strict
 * `z.array(conversationSchema)`, a single malformed conversation would throw and
 * blank the entire sidebar. Degrading by one row beats degrading to nothing.
 *
 * Also tolerates both envelopes: `/conversations` wraps in `{ data: [...] }`
 * while `/users/search` returns a bare array, so the API clearly isn't consistent
 * about this and accepting either costs nothing.
 */
export function parseConversationList(payload: unknown): ConversationListResult {
  const raw = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)
      ? ((payload as { data: unknown[] }).data)
      : null;

  if (!raw) {
    return { conversations: [], skipped: 0 };
  }

  const conversations: Conversation[] = [];
  let skipped = 0;

  for (const item of raw) {
    const parsed = conversationSchema.safeParse(item);
    if (parsed.success) {
      conversations.push(parsed.data);
    } else {
      skipped += 1;
    }
  }

  // Upstream appears to sort by `updatedAt` already, but it isn't documented, and
  // a sidebar in the wrong order is immediately obvious to a user.
  conversations.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return { conversations, skipped };
}
