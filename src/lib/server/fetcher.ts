import "server-only";

import { serverEnv } from "@/lib/env.server";
import { getSessionToken } from "@/lib/auth/session";
import { ApiError, statusToCode, toApiError } from "@/lib/api/errors";

/**
 * Server-side GET helper for the chat API.
 *
 * Every read in the app goes through here, called directly from Server
 * Components — the browser never talks to the chat API itself. That's what lets
 * the JWT stay in an httpOnly cookie: this reads the cookie server-side and
 * attaches the bearer token, so no token and no API URL ever reach client
 * JavaScript.
 *
 * Uses `fetch` rather than axios deliberately. Axios can't participate in Next's
 * request lifecycle — `cache`, `next.revalidate`, and request deduplication are
 * all fetch-level features, and they're the whole point of fetching in a Server
 * Component. Mutations use axios (see `src/app/actions/http.ts`), where none of
 * that applies.
 */

/**
 * The API sleeps on Render's free tier; the first request after an idle period can
 * take 30–50s. A short uniform timeout makes the app look broken on every cold
 * start, so reads a user is waiting on get a generous budget.
 */
const COLD_START_TIMEOUT_MS = 45_000;

type ServerGetOptions = {
  searchParams?: Record<string, string | number | undefined | null>;
  timeoutMs?: number;
  /** Chat data is uncached by default; override for anything genuinely static. */
  cache?: RequestCache;
};

function buildUrl(
  path: string,
  searchParams?: ServerGetOptions["searchParams"],
): string {
  const url = new URL(
    `${serverEnv.CHAT_API_BASE_URL}/${path.replace(/^\/+/, "")}`,
  );

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/** Reads a body without assuming JSON — Render serves HTML error pages on 5xx. */
async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

/** Pulls a message and code out of the API's `{ error: { message, code } }` envelope. */
function describeError(body: unknown, fallback: string) {
  if (body && typeof body === "object") {
    const root = body as Record<string, unknown>;
    const envelope =
      root.error && typeof root.error === "object"
        ? (root.error as Record<string, unknown>)
        : root;

    const message =
      typeof envelope.message === "string" && envelope.message.trim()
        ? envelope.message.trim()
        : fallback;

    // `code` is a number on some responses and a string on others.
    const rawCode = envelope.code;
    const upstreamCode =
      typeof rawCode === "number" || typeof rawCode === "string"
        ? String(rawCode)
        : null;

    return { message, upstreamCode };
  }

  return { message: fallback, upstreamCode: null };
}

/**
 * Authenticated GET. Throws an `ApiError` on any non-2xx, so callers branch on
 * `error.code` — in particular `SESSION_EXPIRED`, which means the cookie is stale
 * and the caller should redirect to login.
 */
export async function serverGet<T = unknown>(
  path: string,
  options: ServerGetOptions = {},
): Promise<T> {
  const {
    searchParams,
    timeoutMs = COLD_START_TIMEOUT_MS,
    cache = "no-store",
  } = options;

  const token = await getSessionToken();

  if (!token) {
    throw new ApiError({
      code: "SESSION_EXPIRED",
      status: 401,
      message: "No active session.",
    });
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, searchParams), {
      method: "GET",
      cache,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    throw toApiError(error);
  }

  const payload = await readBody(response);

  if (!response.ok) {
    const { message, upstreamCode } = describeError(
      payload,
      `GET ${path} failed with ${response.status}.`,
    );

    throw new ApiError({
      code: statusToCode(response.status),
      status: response.status,
      message,
      upstreamCode,
      details: payload,
    });
  }

  return payload as T;
}
