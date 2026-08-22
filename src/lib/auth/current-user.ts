import "server-only";

import { cache } from "react";
import { getMe } from "@/lib/server/chat-data";
import { isApiError } from "@/lib/api/errors";
import { getSessionToken } from "./session";
import { isJwtExpired } from "./jwt";
import type { User } from "@/types/chat";

export type CurrentUserResult =
  | { status: "authenticated"; user: User; token: string }
  /** No cookie, or a token we can already tell is past its `exp`. */
  | { status: "unauthenticated" }
  /** Cookie present but the API rejected the token — it must be cleared. */
  | { status: "expired" }
  /** API unreachable or slow. The session may well be fine; don't log anyone out. */
  | { status: "unavailable"; message: string };

/**
 * Resolves the signed-in user on the server.
 *
 * Wrapped in React's `cache` so a layout and the page it renders share one
 * `/auth/me` call per request instead of hitting a sleeping free-tier instance
 * twice.
 *
 * The four-way result matters: "the API is down" and "your session is invalid" look
 * identical if you only return `User | null`, and conflating them logs users out
 * every time the instance cold-starts slowly. Only `expired` may destroy a session.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUserResult> => {
  const token = await getSessionToken();
  if (!token) return { status: "unauthenticated" };

  // Cheap local check first — skips a guaranteed-401 round trip.
  if (isJwtExpired(token)) return { status: "expired" };

  try {
    const user = await getMe();
    return { status: "authenticated", user, token };
  } catch (error) {
    if (isApiError(error)) {
      if (error.code === "SESSION_EXPIRED" || error.code === "FORBIDDEN") {
        return { status: "expired" };
      }
      return { status: "unavailable", message: error.userMessage };
    }
    return { status: "unavailable", message: "Couldn't verify your session." };
  }
});
