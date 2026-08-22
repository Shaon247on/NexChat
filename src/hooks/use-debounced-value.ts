"use client";

import { useEffect, useState } from "react";

/**
 * Returns `value` after it has stopped changing for `delayMs`.
 *
 * Used to keep `/users/search` from being hit on every keystroke. That matters
 * more than usual here: the API is on a free tier that sleeps, and the search
 * endpoint runs an unindexed regex over the users collection, so an
 * un-debounced input would fire a slow query per character.
 *
 * 300ms is the usual sweet spot — long enough to collapse a burst of typing,
 * short enough that results still feel immediate.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
