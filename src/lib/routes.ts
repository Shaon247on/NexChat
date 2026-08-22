/** Single place for app route paths, so redirects and guards can't drift apart. */
export const ROUTES = {
  home: "/",
  login: "/login",
  chat: "/chat",
} as const;

/** Where a successful login lands. */
export const POST_LOGIN_REDIRECT = ROUTES.chat;

/** Query param used to carry a "why am I back at login?" reason. */
export const LOGIN_REASON_PARAM = "reason";

export type LoginReason = "expired" | "signed-out";
