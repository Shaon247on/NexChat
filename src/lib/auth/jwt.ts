/**
 * Minimal JWT helpers.
 *
 * IMPORTANT: this DECODES, it does not VERIFY. We don't hold the API's HS256
 * signing secret, so a signature check is impossible on our side and the token
 * is treated as opaque — the API remains the only authority on whether it is
 * valid. Everything here is a UX optimisation (match cookie lifetime to token
 * lifetime, avoid a doomed round trip on an obviously stale token), never a
 * security boundary.
 *
 * Uses `atob` rather than `Buffer` so the same code runs in the Edge runtime
 * (middleware) as well as Node.
 */

export interface JwtPayload {
  /** Subject — for this API it equals the user's `_id`. */
  sub?: string;
  /** Issued-at, seconds since epoch. */
  iat?: number;
  /** Expiry, seconds since epoch. Observed lifetime is exactly 7 days. */
  exp?: number;
  [claim: string]: unknown;
}

function base64UrlDecode(segment: string): string | null {
  try {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const binary = atob(padded);
    // Decode as UTF-8 so non-ASCII claims (e.g. a name) survive intact.
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export function decodeJwt(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const json = base64UrlDecode(parts[1]);
  if (!json) return null;

  try {
    const parsed = JSON.parse(json) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as JwtPayload;
  } catch {
    return null;
  }
}

/** Expiry as a Date, or null if the token is unreadable or carries no `exp`. */
export function getJwtExpiry(token: string): Date | null {
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== "number") return null;
  return new Date(payload.exp * 1000);
}

/**
 * Remaining lifetime in seconds, clamped at zero.
 *
 * `skewSeconds` expires the token slightly early so we don't hand the API a
 * credential that dies mid-flight.
 */
export function getJwtTtlSeconds(token: string, skewSeconds = 30): number {
  const expiry = getJwtExpiry(token);
  if (!expiry) return 0;

  const seconds = Math.floor((expiry.getTime() - Date.now()) / 1000) - skewSeconds;
  return Math.max(0, seconds);
}

/**
 * True only when we can read an `exp` AND it has passed. An undecodable token
 * returns false: we can't prove it's expired, so we let the API decide rather
 * than logging someone out on a parsing quirk.
 */
export function isJwtExpired(token: string, skewSeconds = 30): boolean {
  const expiry = getJwtExpiry(token);
  if (!expiry) return false;
  return expiry.getTime() - skewSeconds * 1000 <= Date.now();
}
