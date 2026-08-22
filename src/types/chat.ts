/**
 * Domain types for the chat feature.
 *
 * These are OUR shapes, not the API's. The upstream uses Mongo-style `_id`, is
 * inconsistent about response envelopes, and returns structurally different
 * records for direct vs group conversations. All of that is normalised at the API
 * boundary (see `src/lib/validation/`) before it reaches a component. Nothing
 * above that boundary should ever see `_id` or an empty-object `lastMessage`.
 */

export interface User {
  /** Normalised from the upstream `_id`. */
  id: string;
  name: string;
  /**
   * Free text, NOT a validated phone number.
   *
   * The API does no validation, so real values in the dataset include `"admin"`,
   * `"111"`, `"#2222222222"`, `"+1 (974) 501-5975"`, and at least one record with
   * name and phone swapped. Never parse or assume a format when displaying it.
   */
  phone: string;
  /** ISO-8601. Absent on users embedded in conversation payloads. */
  createdAt?: string;
}

/** Preview of the most recent message, as returned inside a conversation. */
export interface LastMessagePreview {
  text: string;
  /** Upstream sends only the sender's id here, not a user object. */
  senderId: string;
  createdAt: string;
}

interface ConversationBase {
  id: string;
  updatedAt: string;
  /**
   * `null` when the conversation has no messages yet.
   *
   * Upstream represents that as `{}` rather than `null`, which is exactly the
   * shape that makes `lastMessage.text` come back `undefined` instead of failing
   * loudly. Normalised to `null` so an empty conversation is unmissable.
   */
  lastMessage: LastMessagePreview | null;
}

/** One-to-one chat. Upstream provides a single `participant`, and no name. */
export interface DirectConversation extends ConversationBase {
  type: "direct";
  /** The other person. Undefined if upstream omitted them (seen with deleted users). */
  participant?: User;
}

/** Group chat: three or more members, a name, and one or more admins. */
export interface GroupConversation extends ConversationBase {
  type: "group";
  name: string;
  createdById: string;
  /** Ids only, not user objects — cross-reference against `participants`. */
  adminIds: string[];
  participants: User[];
}

export type Conversation = DirectConversation | GroupConversation;

/* ─────────────────────────── messages ─────────────────────────── */

/**
 * Delivery state of a message in the UI.
 *
 * `failed` is not hypothetical: `POST /messages` answers a rejected send with a
 * `null` body rather than an error status, so "sent" has to be proven, not
 * assumed.
 */
export type MessageStatus = "sent" | "sending" | "failed";

export interface Message {
  /** Normalised from `_id`. For an unsent optimistic message this is `clientId`. */
  id: string;
  /** Normalised from the response's `conversation` field. */
  conversationId: string;
  /** Upstream sends only the sender's id, never a user object. */
  senderId: string;
  text: string;
  createdAt: string;
  /** Absent on messages loaded from history — those are, by definition, sent. */
  status?: MessageStatus;
  /**
   * Client-generated id for an optimistic message, kept after reconciliation so a
   * server echo (POST response or `message:new`) can be matched to the bubble
   * already on screen instead of rendering a duplicate.
   */
  clientId?: string;
}

/* ─────────────────────────── helpers ─────────────────────────── */

/**
 * Display title for either conversation kind.
 *
 * Direct conversations carry no `name` of their own — the title is the other
 * person — so every consumer would otherwise reimplement this branch.
 */
export function getConversationTitle(conversation: Conversation): string {
  if (conversation.type === "group") return conversation.name;
  return conversation.participant?.name ?? "Unknown contact";
}

/** Members of a conversation, normalised across both kinds. */
export function getConversationMembers(conversation: Conversation): User[] {
  if (conversation.type === "group") return conversation.participants;
  return conversation.participant ? [conversation.participant] : [];
}

export function isGroupAdmin(
  conversation: Conversation,
  userId: string,
): boolean {
  return (
    conversation.type === "group" && conversation.adminIds.includes(userId)
  );
}

/**
 * Finds an existing direct conversation with a given person.
 *
 * This exists to sidestep an API ambiguity. `POST /conversations` with someone you
 * already have a direct chat with returns **success**, indistinguishable from
 * having created a new one — so the response alone can't tell you whether you're
 * looking at a fresh conversation or an existing one with history.
 *
 * Rather than trying to detect that after the fact, we check locally first: if a
 * direct conversation already exists, open it and skip the request entirely. The
 * POST only happens when there genuinely isn't one. That removes the ambiguity
 * instead of working around it, and saves a round trip in the common case of
 * messaging someone you already talk to.
 */
export function findDirectConversationWith(
  conversations: Conversation[],
  userId: string,
): DirectConversation | undefined {
  return conversations.find(
    (conversation): conversation is DirectConversation =>
      conversation.type === "direct" && conversation.participant?.id === userId,
  );
}
