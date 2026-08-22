import { z } from "zod";

/**
 * Client-safe environment. Only NEXT_PUBLIC_ vars belong here, and they must be
 * referenced as literal `process.env.NEXT_PUBLIC_X` so Next can inline them at
 * build time — dynamic lookups like `process.env[key]` are not replaced and come
 * back undefined in the browser.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SOCKET_URL: z
    .string()
    .url("NEXT_PUBLIC_SOCKET_URL must be a full URL")
    .transform((value) => value.replace(/\/+$/, "")),
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
});

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid public environment.\n${issues}`);
}

export const publicEnv = parsed.data;
