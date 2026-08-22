/**
 * Auth constants shared between server-only modules and the Edge middleware.
 *
 * Kept in its own file because `session.ts` is marked `server-only` (it uses
 * `next/headers`), and middleware cannot import that — but both need the same
 * cookie name. Duplicating the string is exactly how a rename silently breaks
 * route protection.
 */
export const SESSION_COOKIE = "chat_session";
