import "server-only";

import axios, { type AxiosInstance } from "axios";
import { serverEnv } from "@/lib/env.server";
import { getSessionToken } from "@/lib/auth/session";
import { ApiError, statusToCode } from "@/lib/api/errors";

/**
 * Axios client for Server Actions (writes).
 *
 * Reads the JWT from the httpOnly cookie on every call, so no token reaches the
 * browser. Axios is used here rather than `fetch` because mutations don't need
 * Next's fetch-level caching or revalidation hooks, and axios gives us
 * throw-on-non-2xx, a built-in timeout, and JSON handling for free.
 *
 * A fresh instance per call, not a module-level singleton: the token is
 * request-scoped, and a shared instance on the server would risk one request's
 * Authorization header leaking into another's.
 */

/** Render's free tier sleeps; a user waiting on a write deserves a real budget. */
const TIMEOUT_MS = 45_000;

export async function createApiClient(): Promise<AxiosInstance> {
  const token = await getSessionToken();

  if (!token) {
    throw new ApiError({
      code: "SESSION_EXPIRED",
      status: 401,
      message: "No active session.",
    });
  }

  return axios.create({
    baseURL: serverEnv.CHAT_API_BASE_URL,
    timeout: TIMEOUT_MS,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

/** Client for unauthenticated calls — login only. */
export function createPublicApiClient(): AxiosInstance {
  return axios.create({
    baseURL: serverEnv.CHAT_API_BASE_URL,
    timeout: TIMEOUT_MS,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

/**
 * Normalises anything axios throws into our `ApiError`.
 *
 * Handles the API's nested `{ error: { message, code } }` envelope, and the fact
 * that `code` is a number in some responses and a string in others.
 */
export function fromAxiosError(error: unknown, fallback: string): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return new ApiError({
        code: "TIMEOUT",
        message: "The server took too long to respond.",
      });
    }

    const status = error.response?.status ?? null;
    const body = error.response?.data as unknown;

    let message = fallback;
    let upstreamCode: string | null = null;

    if (body && typeof body === "object") {
      const root = body as Record<string, unknown>;
      const envelope =
        root.error && typeof root.error === "object"
          ? (root.error as Record<string, unknown>)
          : root;

      if (typeof envelope.message === "string" && envelope.message.trim()) {
        message = envelope.message.trim();
      }
      const rawCode = envelope.code;
      if (typeof rawCode === "number" || typeof rawCode === "string") {
        upstreamCode = String(rawCode);
      }
    }

    if (status === null) {
      return new ApiError({ code: "NETWORK", message: "Couldn't reach the server." });
    }

    return new ApiError({
      code: statusToCode(status),
      status,
      message,
      upstreamCode,
      details: body,
    });
  }

  return new ApiError({
    code: "SERVER",
    message: error instanceof Error ? error.message : fallback,
  });
}

/**
 * Result shape every action returns.
 *
 * Actions return errors rather than throwing them: an uncaught throw in a Server
 * Action is replaced by a generic message in production, which would lose the
 * useful part. This keeps failures serialisable and specific.
 */
export type ActionFailure = { ok: false; message: string; code: string };

export type ActionResult<T = null> = { ok: true; data: T } | ActionFailure;

export function actionError(error: unknown, fallback: string): ActionFailure {
  const apiError = fromAxiosError(error, fallback);
  return { ok: false, message: apiError.userMessage, code: apiError.code };
}

/** Per-field messages for the login form. */
export type LoginFieldErrors = Partial<Record<"phone" | "name", string>>;

/**
 * Login only ever *returns* on failure — success redirects, which throws. So there
 * is no success variant here.
 */
export type LoginResult = ActionFailure & { fieldErrors?: LoginFieldErrors };
