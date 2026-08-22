"use client";

import { useSearchParams } from "next/navigation";
import { Info } from "lucide-react";
import { LOGIN_REASON_PARAM } from "@/lib/routes";

const MESSAGES: Record<string, string> = {
  expired: "Your session expired, so you'll need to sign in again.",
  "signed-out": "You've been signed out.",
};

/**
 * Explains *why* the user is looking at a login screen they didn't ask for.
 *
 * Split out as its own client component so reading `searchParams` doesn't force
 * the whole login page to render dynamically — the page shell stays static and
 * this streams in behind a Suspense boundary. That's the pattern PPR needs, and
 * it works today without the flag.
 */
export default function LoginNotice() {
  const searchParams = useSearchParams();
  const reason = searchParams.get(LOGIN_REASON_PARAM);

  // "signed-out" after a deliberate logout isn't worth a banner.
  if (!reason || reason === "signed-out") return null;

  const message = MESSAGES[reason];
  if (!message) return null;

  return (
    <div
      role="status"
      className="mb-6 flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs leading-relaxed text-blue-800"
    >
      <Info className="mt-px size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
