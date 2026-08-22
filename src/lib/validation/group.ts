import { z } from "zod";
import { nameSchema } from "./auth";

/**
 * A group needs **three or more members**, so the creator must pick at least two
 * other people — the creator is added implicitly and is not part of
 * `participantIds`.
 *
 * Enforced client-side because the failure is otherwise a rejected request after
 * the user has filled in a form, which is a worse experience than a disabled
 * button explaining what's missing.
 */
export const MIN_GROUP_PARTICIPANTS = 2;

export const groupNameSchema = nameSchema;

export const createGroupInputSchema = z.object({
  name: groupNameSchema,
  participantIds: z
    .array(z.string().min(1))
    .min(
      MIN_GROUP_PARTICIPANTS,
      `Pick at least ${MIN_GROUP_PARTICIPANTS} people — a group needs three members including you.`,
    ),
});

export type CreateGroupInput = z.infer<typeof createGroupInputSchema>;
