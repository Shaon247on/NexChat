import { NextResponse, type NextRequest } from "next/server";
import { getSessionToken } from "@/lib/auth/session";
import { getJwtExpiry, isJwtExpired } from "@/lib/auth/jwt";

/**
 * Hands the JWT to the browser for the Socket.io handshake.
 *
 * This is the one deliberate hole in the httpOnly-cookie design, and it exists
 * because Socket.io requires the token in client JS:
 *
 *   io(url, { auth: { token } })
 *
 * Worth being straight about the consequence: because this endpoint exists, the
 * httpOnly cookie is not absolute XSS protection. What the cookie still buys us
 * is a server-readable session — so Server Components can resolve the user and
 * the chat shell renders without a skeleton flash — plus a single place where
 * REST auth and error normalisation happen. Those are the honest wins; "the
 * token is unreachable from JS" is not one of them.
 *
 * The token is returned only to same-origin callers holding a valid cookie, and
 * never cached.
 */

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // `sameSite: 'lax'` already stops cross-site fetches from carrying the cookie;
  // this rejects the remaining odd cases (e.g. a top-level navigation) rather
  // than rendering the token into a page the user can be tricked into opening.
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Cross-origin request rejected." } },
      { status: 403 },
    );
  }

  const token = await getSessionToken();

  if (!token || isJwtExpired(token)) {
    return NextResponse.json(
      { error: { code: "SESSION_EXPIRED", message: "No active session." } },
      { status: 401 },
    );
  }

  const expiresAt = getJwtExpiry(token);

  return NextResponse.json(
    { token, expiresAt: expiresAt ? expiresAt.toISOString() : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
