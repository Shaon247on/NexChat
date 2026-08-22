import { z } from "zod";
import type { User } from "@/types/chat";

/**
 * The upstream user shape, normalised into our domain `User`.
 *
 * Two accommodations, both driven by observed behaviour rather than guesswork:
 *
 * 1. `_id` is accepted OR `id`. `/auth/login` and `/auth/me` both return `_id`,
 *    but response bodies are undocumented for this task and endpoints that embed
 *    a user (conversation participants, message senders) may well differ. Taking
 *    either costs one line and avoids a class of silent `undefined` ids.
 * 2. `createdAt` is optional, so an embedded partial user doesn't fail the whole
 *    parse of a conversation list.
 */
export const apiUserSchema = z
  .object({
    _id: z.string().min(1).optional(),
    id: z.string().min(1).optional(),
    name: z.string(),
    phone: z.string(),
    createdAt: z.string().optional(),
  })
  .transform((raw, ctx): User => {
    const id = raw._id ?? raw.id;

    if (!id) {
      ctx.addIssue({
        code: "custom",
        message: "User object has neither `_id` nor `id`.",
      });
      return z.NEVER;
    }

    return {
      id,
      name: raw.name,
      phone: raw.phone,
      createdAt: raw.createdAt,
    };
  });

export type ApiUser = z.infer<typeof apiUserSchema>;

/**
 * Minimum characters before a search is worth sending — one letter matches most of
 * the directory.
 *
 * Lives here rather than in the action module because a `"use server"` file may only
 * export async functions; exporting a constant from one is a build error. Both the
 * action and the UI need this value, so it belongs in shared validation code.
 */
export const MIN_SEARCH_LENGTH = 2;

/**
 * Parses a user list, tolerating a bad record rather than losing the whole list.
 *
 * `/users/search` returns a **bare array**, while `/conversations` wraps its
 * payload in `{ data: [...] }`. Both are accepted here because the API is
 * demonstrably inconsistent about envelopes and guessing wrong yields an empty
 * list with no error.
 */
export function parseUserList(payload: unknown): User[] {
  const raw = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: unknown[] }).data
      : null;

  if (!raw) return [];

  const users: User[] = [];
  for (const item of raw) {
    const parsed = apiUserSchema.safeParse(item);
    if (parsed.success) users.push(parsed.data);
  }
  return users;
}

/**
 * Escapes regex metacharacters before a term is sent to `/users/search`.
 *
 * The endpoint interpolates the query into a regular expression without escaping
 * it — searching for `+` yields:
 *
 *   "Regular expression is invalid: quantifier does not follow a repeatable item"
 *
 * which is a regex compiler error surfacing as a failed request. That matters a
 * lot here because every phone number in this system starts with `+`, so the most
 * obvious search a user can type is the one that breaks it. Escaping client-side
 * turns the term into a literal match and stops the endpoint throwing.
 */
export function escapeSearchTerm(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Whether a search term looks like the user is trying to find someone by number.
 *
 * `/users/search` matches on **name only** — a phone number returns an empty
 * array, not an error, which is indistinguishable from "no such person". Knowing
 * the difference lets the UI explain itself instead of showing a bare "no
 * results" for a query that could never have matched.
 */
export function looksLikePhoneNumber(term: string): boolean {
  const trimmed = term.trim();
  if (trimmed.length < 3) return false;
  // Mostly digits, with the punctuation people type into phone fields.
  return /^[+\d][\d\s().-]*$/.test(trimmed);
}

