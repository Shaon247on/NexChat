import { z } from "zod";

/**
 * Server-only environment. Never import this from a "use client" module —
 * `CHAT_API_BASE_URL` is not a NEXT_PUBLIC_ var, so it is undefined in the
 * browser and validation would fail at import time.
 *
 * Client-safe values live in `env.public.ts`.
 */
const serverEnvSchema = z.object({
  CHAT_API_BASE_URL: z
    .string()
    .url("CHAT_API_BASE_URL must be a full URL, e.g. https://host/api")
    // A trailing slash here silently produces `//auth/login` once paths are
    // joined, which some servers 404 on. Normalise once, at the source.
    .transform((value) => value.replace(/\/+$/, "")),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

function loadServerEnv() {
  const parsed = serverEnvSchema.safeParse({
    CHAT_API_BASE_URL: process.env.CHAT_API_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    // Fail loudly at boot rather than letting `undefined` flow into a fetch URL
    // and surface later as an unexplained "fetch failed".
    throw new Error(
      `Invalid server environment.\n${issues}\n\nCopy .env.example to .env.local and fill it in.`,
    );
  }

  return parsed.data;
}

export const serverEnv = loadServerEnv();

export const isProduction = serverEnv.NODE_ENV === "production";
