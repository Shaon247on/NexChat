import "server-only";

import { cache } from "react";
import { serverGet } from "./fetcher";
import {
  parseConversationList,
  type ConversationListResult,
} from "@/lib/validation/conversation";
import {
  parseMessageHistory,
  type MessageHistory,
} from "@/lib/validation/message";
import { meResponseSchema } from "@/lib/validation/auth";
import type { User } from "@/types/chat";

/**
 * Read functions for Server Components.
 *
 * All wrapped in React's `cache`, so a layout and the page it renders share one
 * request instead of hitting a sleeping free-tier instance twice for the same data.
 */

/** Default page size for message history. */
export const DEFAULT_MESSAGE_LIMIT = 20;
/** Ceiling on the grow-the-limit pagination, so a long thread can't request 10k rows. */
export const MAX_MESSAGE_LIMIT = 500;

/** `GET /auth/me` — the authoritative identity for the current token. */
export const getMe = cache(async (): Promise<User> => {
  const payload = await serverGet("auth/me");
  return meResponseSchema.parse(payload);
});

/**
 * `GET /conversations`.
 *
 * Parsed record-by-record: the endpoint has no pagination, inlines every
 * participant, and the live data is messy (one record has name and phone swapped),
 * so one malformed conversation must cost one row rather than the whole sidebar.
 */
export const getConversations = cache(
  async (): Promise<ConversationListResult> => {
    const payload = await serverGet("conversations");
    return parseConversationList(payload);
  },
);

/**
 * `GET /conversations/{id}/messages?limit=`.
 *
 * Pagination here is grow-the-limit rather than cursor-based: the endpoint exposes
 * a `limit` and reports `hasMore`, so loading older messages means asking for a
 * bigger page. Not as efficient as a cursor — it refetches what we already had —
 * but it's what the API offers, and it keeps the request idempotent, which means a
 * "load older" action is just a URL with a larger number in it.
 */
export const getMessages = cache(
  async (
    conversationId: string,
    limit: number = DEFAULT_MESSAGE_LIMIT,
  ): Promise<MessageHistory> => {
    const safeLimit = Math.min(
      Math.max(Math.trunc(limit) || DEFAULT_MESSAGE_LIMIT, 1),
      MAX_MESSAGE_LIMIT,
    );

    const payload = await serverGet(
      `conversations/${conversationId}/messages`,
      { searchParams: { limit: safeLimit } },
    );

    return parseMessageHistory(payload);
  },
);
