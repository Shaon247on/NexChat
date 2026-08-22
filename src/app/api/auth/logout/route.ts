import { NextResponse, type NextRequest } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";
import { LOGIN_REASON_PARAM, ROUTES } from "@/lib/routes";

/**
 * Clears the session cookie, then redirects to login.
 *
 * This exists because of a specific loop. Server Components cannot write
 * cookies, so when `getCurrentUser()` discovers the API has rejected a token
 * that has NOT yet passed its `exp`, the chat layout can only redirect — it
 * can't delete the cookie. Middleware would then see a present, not-yet-expired
 * cookie on `/login`, consider the user signed in, and send them straight back
 * to `/chat`. Forever.
 *
 * A route handler can write cookies, so bouncing through here removes the cookie
 * before `/login` is reached and the cycle can't form.
 *
 * GET is correct here despite being a state change: it is the target of a
 * redirect, not a user-triggered action. Deliberate sign-out from the UI goes
 * through `logoutAction` instead.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const reason = request.nextUrl.searchParams.get(LOGIN_REASON_PARAM) ?? "expired";

  await clearSessionCookie();

  const loginUrl = new URL(ROUTES.login, request.url);
  loginUrl.searchParams.set(LOGIN_REASON_PARAM, reason);

  return NextResponse.redirect(loginUrl);
}
