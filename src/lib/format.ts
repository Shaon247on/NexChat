/**
 * Display formatting helpers.
 *
 * ## A note on hydration
 *
 * Timestamps are formatted with the *viewer's* locale and timezone, which the
 * server doesn't know. Since the chat shell is server-rendered with seeded data,
 * the server and client can legitimately produce different strings for the same
 * instant. The `<time>` elements that use these carry `suppressHydrationWarning`
 * for exactly that reason — the client value is the correct one and wins on
 * hydration. The alternative, deferring all formatting to after mount, trades a
 * non-issue for a visible flash of empty timestamps.
 */

const MS_PER_DAY = 86_400_000;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * Conversation-list timestamp, following the convention people already know from
 * messaging apps: time today, "Yesterday", weekday within the last week, then a
 * date.
 */
export function formatConversationTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const daysApart = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / MS_PER_DAY,
  );

  if (daysApart <= 0) {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (daysApart === 1) return "Yesterday";
  if (daysApart < 7) return date.toLocaleDateString(undefined, { weekday: "short" });

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

/** Full timestamp for a `title`/tooltip, so the abbreviated form stays inspectable. */
export function formatFullTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * Up to two initials from a display name.
 *
 * Guards against the live dataset, which contains names like `"admin"`, `"as"`,
 * `"111"`, and at least one record where name and phone are swapped — so a naive
 * `split(" ")[1][0]` would throw.
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Stable index into a colour list, derived from an id.
 *
 * Deterministic on purpose: a random or index-based colour would differ between
 * server and client render, and would change as the list reorders.
 */
export function stableIndex(seed: string, buckets: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % buckets;
}
