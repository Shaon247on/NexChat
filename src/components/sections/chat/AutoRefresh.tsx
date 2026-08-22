"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Real-time updates, without a client-side data cache.
 *
 * With all reads happening in Server Components there is nothing on the client to
 * refetch, so "new messages appear without the user refreshing" is done by calling
 * `router.refresh()` on an interval. That re-runs the server components and streams
 * fresh props down, preserving client state (scroll position, composer text, open
 * dialogs) — it is not a page reload.
 *
 * Two deliberate details:
 *
 * - **Pauses when the tab is hidden.** The API is on a free tier that sleeps; there
 *   is no reason to poll a backgrounded tab, and refreshing on `visibilitychange`
 *   means returning to the tab shows current state immediately anyway.
 * - **Refreshes on regaining focus**, so switching back from another window doesn't
 *   wait out the remainder of an interval.
 *
 * This is the fallback design. Once the Socket.io layer lands, `message:new` drives
 * updates and this interval can slow dramatically or disappear.
 */
const POLL_INTERVAL_MS = 5_000;

export default function AutoRefresh({
  intervalMs = POLL_INTERVAL_MS,
}: {
  intervalMs?: number;
}) {
  const router = useRouter();
  // Kept in a ref so the effect doesn't re-subscribe when the router identity changes.
  const refreshRef = useRef(() => router.refresh());
  refreshRef.current = () => router.refresh();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (timer) return;
      timer = setInterval(() => refreshRef.current(), intervalMs);
    };

    const stop = () => {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        refreshRef.current();
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [intervalMs]);

  return null;
}
