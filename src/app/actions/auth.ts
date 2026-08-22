"use server";

import { redirect } from "next/navigation";
import {
  createPublicApiClient,
  actionError,
  type LoginFieldErrors,
  type LoginResult,
} from "./http";
import { clearSessionCookie, setSessionCookie } from "@/lib/auth/session";
import {
  loginInputSchema,
  loginResponseSchema,
  type LoginFormValues,
} from "@/lib/validation/auth";
import {
  LOGIN_REASON_PARAM,
  POST_LOGIN_REDIRECT,
  ROUTES,
  type LoginReason,
} from "@/lib/routes";

/**
 * `POST /auth/login` — signs in, or registers automatically if the phone is new.
 *
 * A Server Action because only the server can set an httpOnly cookie, which is what
 * lets Server Components resolve the session and render the chat shell with the user
 * already known.
 *
 * The same zod schema runs in the browser for instant feedback and again here — the
 * client copy is UX, this one is the gate.
 */
export async function login(
  values: LoginFormValues,
  next?: string | null,
): Promise<LoginResult> {
  const parsed = loginInputSchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors: LoginFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if ((field === "phone" || field === "name") && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }

    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      code: "VALIDATION",
      fieldErrors,
    };
  }

  try {
    const api = createPublicApiClient();
    const { data } = await api.post("/auth/login", {
      phone: parsed.data.phone,
      name: parsed.data.name,
    });

    const validated = loginResponseSchema.safeParse(data);
    if (!validated.success) {
      return {
        ok: false,
        message: "The server sent an unexpected sign-in response.",
        code: "PARSE",
      };
    }

    // Cookie lifetime is derived from the token's own `exp` (7 days), so the cookie
    // and the credential expire together.
    await setSessionCookie(validated.data.token);
  } catch (error) {
    const result = actionError(error, "Couldn't sign you in.");

    // A 400/422 is about the submitted values; the phone is the only field the API
    // can reasonably reject.
    if (result.code === "VALIDATION") {
      return { ...result, fieldErrors: { phone: result.message } };
    }

    return result;
  }

  // Outside the try/catch: `redirect` signals by throwing, and a catch block would
  // swallow it and report a phantom login failure.
  redirect(resolveRedirect(next));
}

/**
 * `next` comes from a query param, so it's attacker-controllable. Anything that
 * isn't a plain same-origin path is discarded. `//evil.com` is the case worth
 * naming: it looks relative but browsers treat it as protocol-relative.
 */
function resolveRedirect(next?: string | null): string {
  if (!next) return POST_LOGIN_REDIRECT;
  if (!next.startsWith("/") || next.startsWith("//")) return POST_LOGIN_REDIRECT;
  return next;
}

/**
 * Ends the session.
 *
 * There is no logout endpoint and no refresh token to revoke — the JWT stays valid
 * until its 7-day `exp`. Dropping the cookie is the whole of logout on our side,
 * which is worth stating plainly rather than implying anything was invalidated
 * server-side.
 */
export async function logout(
  reason: LoginReason = "signed-out",
): Promise<never> {
  await clearSessionCookie();
  redirect(`${ROUTES.login}?${LOGIN_REASON_PARAM}=${reason}`);
}
