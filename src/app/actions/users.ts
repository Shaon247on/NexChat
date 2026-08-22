"use server";

import { serverGet } from "@/lib/server/fetcher";
import { actionError, type ActionResult } from "./http";
import {
  escapeSearchTerm,
  parseUserList,
  MIN_SEARCH_LENGTH,
} from "@/lib/validation/user";
import type { User } from "@/types/chat";

/**
 * `GET /users/search?q=` — find people to start a conversation with.
 *
 * This is a Server Action rather than a Server Component read, because the search
 * term is live keyboard input. Making it a component read would mean pushing every
 * debounced keystroke into the URL and re-rendering the route; an action lets the
 * request stay server-side (token in the httpOnly cookie, no client API access)
 * while the input stays local state.
 *
 * Two API behaviours are handled here:
 *
 * 1. **It matches on name only.** A phone number returns `[]`, not an error, which
 *    is indistinguishable from "no such person" — the UI distinguishes them.
 * 2. **It interpolates the term into a regex unescaped.** A bare `+` makes the
 *    endpoint throw `"Regular expression is invalid…"`. That matters because every
 *    phone number here starts with `+`, so the most obvious search a user can type
 *    is the one that breaks it. `escapeSearchTerm` neutralises it before sending.
 */
export async function searchUsers(
  term: string,
): Promise<ActionResult<User[]>> {
  const trimmed = term.trim();

  if (trimmed.length < MIN_SEARCH_LENGTH) {
    return { ok: true, data: [] };
  }

  try {
    const payload = await serverGet("users/search", {
      searchParams: { q: escapeSearchTerm(trimmed) },
      // Search is typed at, not waited on across a cold start — fail fast so the
      // input stays responsive.
      timeoutMs: 15_000,
    });

    return { ok: true, data: parseUserList(payload) };
  } catch (error) {
    return actionError(error, "Couldn't search for people.");
  }
}
