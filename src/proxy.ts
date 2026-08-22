import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { isJwtExpired } from "@/lib/auth/jwt";
import { LOGIN_REASON_PARAM, ROUTES } from "@/lib/routes";

/**
 * Routing guard, not a security boundary.
 *
 * Next 16 renamed this convention: `middleware.ts` exporting `middleware()` is
 * deprecated in favour of `proxy.ts` exporting `proxy()`. Keeping both files is a
 * hard build error, so there is only this one.
 *
 * All this does is keep people from staring at a shell they can't use: it checks
 * whether a session cookie exists and whether its `exp` has passed. It cannot
 * verify the signature (we don't hold the secret), so a forged cookie would sail
 * through here — and that is fine, because every actual data request is
 * authorised by the API itself via the BFF.
 *
 * Real invalidity is caught one layer in: `/auth/me` returns 401 and
 * `getCurrentUser()` reports `expired`.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const hasUsableToken = Boolean(token) && !isJwtExpired(token!);

  if (pathname === ROUTES.login) {
    // Already signed in — no reason to show the login form again.
    if (hasUsableToken) {
      return NextResponse.redirect(new URL(ROUTES.chat, request.url));
    }

    // Cookie exists but is past its exp: let the login page render, and clear the
    // dead cookie on the way so it stops triggering this branch.
    if (token) {
      const response = NextResponse.next();
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }

    return NextResponse.next();
  }

  // Protected area.
  if (!hasUsableToken) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set(LOGIN_REASON_PARAM, token ? "expired" : "signed-out");

    // Remember where they were headed so login can return them there.
    const intended = `${pathname}${search}`;
    if (intended && intended !== ROUTES.chat) {
      loginUrl.searchParams.set("next", intended);
    }

    const response = NextResponse.redirect(loginUrl);
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat", "/chat/:path*", "/login"],
};
