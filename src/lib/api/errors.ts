/**
 * One error type for every failure mode the chat API can produce, so callers
 * branch on a stable `code` instead of sniffing status numbers or matching on
 * message strings.
 */
export type ApiErrorCode =
  | "SESSION_EXPIRED" // 401 — token missing, malformed, or past its 7-day exp
  | "FORBIDDEN" // 403 — authenticated but not allowed (e.g. non-admin renaming a group)
  | "NOT_FOUND" // 404
  | "VALIDATION" // 400 / 422 — request body rejected
  | "CONFLICT" // 409
  | "RATE_LIMITED" // 429
  | "SERVER" // 5xx
  | "TIMEOUT" // request exceeded our budget (see COLD_START_TIMEOUT_MS)
  | "NETWORK" // DNS/TCP failure, offline
  | "PARSE"; // 2xx body did not match the schema we expected

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number | null;
  readonly details: unknown;
  /**
   * The API's own error code, verbatim from `{ error: { code } }`.
   *
   * Kept separate from our semantic `code` because it is an upstream identifier
   * (e.g. `51091`), useful for logs and for the API-quirks write-up, but not
   * something the UI should branch on. Normalised to a string because the API is
   * inconsistent about whether it sends a number or a string here.
   */
  readonly upstreamCode: string | null;

  constructor({
    code,
    message,
    status = null,
    details = null,
    upstreamCode = null,
  }: {
    code: ApiErrorCode;
    message: string;
    status?: number | null;
    details?: unknown;
    upstreamCode?: string | null;
  }) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
    this.upstreamCode = upstreamCode;
  }

  /**
   * Whether retrying the identical request could plausibly succeed. Drives both
   * TanStack Query's `retry` predicate and the BFF's decision to surface a
   * "try again" affordance. 4xx is never retried — the request itself is wrong,
   * so repeating it just burns the API's free-tier budget.
   */
  get isRetryable(): boolean {
    return (
      this.code === "TIMEOUT" ||
      this.code === "NETWORK" ||
      this.code === "SERVER"
    );
  }

  /**
   * A message safe and useful to show a user. Upstream error text is often
   * either absent or an internal detail, so anything not deliberately worded
   * here gets a human fallback.
   */
  get userMessage(): string {
    switch (this.code) {
      case "SESSION_EXPIRED":
        return "Your session has expired. Please sign in again.";
      case "FORBIDDEN":
        return "You don't have permission to do that.";
      case "NOT_FOUND":
        return "That conversation no longer exists.";
      case "VALIDATION":
        return this.message || "Please check the details and try again.";
      case "CONFLICT":
        return this.message || "That conflicts with something that already exists.";
      case "RATE_LIMITED":
        return "Too many requests. Give it a moment and try again.";
      case "TIMEOUT":
        return "The server took too long to respond. It may be waking up — try again.";
      case "NETWORK":
        return "Can't reach the server. Check your connection.";
      case "SERVER":
        return "The server ran into a problem. Please try again.";
      case "PARSE":
        return "The server sent something unexpected.";
    }
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        status: this.status,
        upstreamCode: this.upstreamCode,
      },
    };
  }
}

export function statusToCode(status: number): ApiErrorCode {
  if (status === 401) return "SESSION_EXPIRED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 429) return "RATE_LIMITED";
  if (status === 400 || status === 422) return "VALIDATION";
  if (status >= 500) return "SERVER";
  return "SERVER";
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Narrows an unknown thrown value to an ApiError. Anything that isn't already
 * one — a TypeError from a bad fetch, a DOMException from an abort — gets
 * classified rather than leaking a raw runtime error into the UI.
 */
export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;

  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiError({
      code: "TIMEOUT",
      message: "Request aborted after exceeding the timeout budget.",
    });
  }

  if (error instanceof TypeError) {
    return new ApiError({
      code: "NETWORK",
      message: error.message || "Network request failed.",
    });
  }

  return new ApiError({
    code: "SERVER",
    message: error instanceof Error ? error.message : "Unknown error.",
  });
}
