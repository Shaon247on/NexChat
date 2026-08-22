import "server-only";

import { cookies } from "next/headers";
import { getJwtTtlSeconds } from "./jwt";
import { SESSION_COOKIE } from "./constants";
import { isProduction } from "@/lib/env.server";

export { SESSION_COOKIE };

/** Fallback lifetime if the token carries no readable `exp`. Observed exp is 7 days. */
const FALLBACK_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE)?.value;
  return value && value.length > 0 ? value : null;
}

/**
 * Stores the JWT and nothing else.
 *
 * Deliberately no user profile in a companion cookie: `GET /auth/me` is the
 * single source of truth for identity, so duplicating it here would just create
 * a second copy to go stale after a rename.
 *
 * Cookie lifetime is derived from the token's own `exp` so the browser drops the
 * cookie at roughly the moment the credential stops working — the alternative is
 * a cookie that outlives its token and produces confusing mid-session 401s.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  const ttl = getJwtTtlSeconds(token);

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: ttl > 0 ? ttl : FALLBACK_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  // Match the original attributes — a delete that differs on path is a no-op.
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 0,
  });
}
