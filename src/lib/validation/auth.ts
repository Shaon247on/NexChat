import { z } from "zod";
import { apiUserSchema } from "./user";

/**
 * Phone validation is deliberately permissive.
 *
 * The sample number `+880140060` has only nine digits after the country code —
 * not a real Bangladeshi subscriber number — and the API registers it happily.
 * So we enforce E.164's *length* bounds (7–15 digits) and nothing else. Running
 * strict per-country rules here would reject numbers the server demonstrably
 * accepts, which is a worse failure than letting an odd one through.
 *
 * Common typing noise (spaces, dashes, dots, parentheses) is stripped before
 * validating, so the value we store is canonical — that matters because users
 * are later looked up *by number*, and "+1 555 123 4567" must find the same
 * account as "+15551234567".
 */
export const phoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s().-]/g, ""))
  .refine((value) => /^\+[1-9]\d{6,14}$/.test(value), {
    message:
      "Use international format, starting with + and the country code (e.g. +8801700000000).",
  });

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Please enter your name.")
  .max(60, "Name can't be longer than 60 characters.");

/**
 * `POST /auth/login` — doubles as sign-up. A phone number that isn't registered
 * yet creates an account; an existing one signs in. There is no separate
 * registration endpoint.
 */
export const loginInputSchema = z.object({
  phone: phoneSchema,
  name: nameSchema,
});

/** What the form holds (pre-transform) vs. what the server sends on (post-transform). */
export type LoginFormValues = z.input<typeof loginInputSchema>;
export type LoginInput = z.output<typeof loginInputSchema>;

/** Login returns the user NESTED under `user`, alongside the JWT. */
export const loginResponseSchema = z.object({
  token: z.string().min(1),
  user: apiUserSchema,
});

/**
 * `GET /auth/me` returns the user BARE at the top level — no `user` wrapper,
 * unlike login. Normalising both through `apiUserSchema` is what keeps that
 * inconsistency from leaking past this file.
 */
export const meResponseSchema = apiUserSchema;

/** Discriminated result returned by the login Server Action. */
export type LoginActionState =
  | { status: "idle" }
  | {
      status: "error";
      /** Message for the form-level banner/toast. */
      message: string;
      /** Per-field messages, keyed by form field name. */
      fieldErrors?: Partial<Record<keyof LoginFormValues, string>>;
      /** True when retrying the same input could plausibly work (timeout, 5xx). */
      retryable?: boolean;
    };
