"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Keeps a scroll container pinned to the bottom — but only while the user wants
 * it there.
 *
 * The requirement this implements: auto-scroll to the newest message by default,
 * and *never* yank someone downward while they're reading history. Those two
 * pull in opposite directions, so the rules are explicit:
 *
 * - Within `threshold` px of the bottom → treat as "following", and follow.
 * - Scrolled up beyond that → don't move the viewport. Count what arrives instead,
 *   so the UI can offer a jump-to-latest rather than deciding for them.
 * - A message the user just sent always scrolls, regardless. Pressing send is an
 *   unambiguous statement that you want to see the result.
 * - Switching conversations jumps instantly, before paint — animating a scroll
 *   through someone else's history is visual noise.
 *
 * `threshold` is 120px rather than 0 because "at the bottom" needs slack: sub-pixel
 * rounding, and a user one line up is still following the conversation.
 */
export function useStickToBottom({ threshold = 120 }: { threshold?: number } = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isFollowing, setIsFollowing] = useState(true);
  const [missedCount, setMissedCount] = useState(0);

  // Mirrors `isFollowing` for reads inside callbacks that must not re-subscribe
  // on every state change.
  const isFollowingRef = useRef(true);

  const measure = useCallback(() => {
    const element = containerRef.current;
    if (!element) return true;

    const distanceFromBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight;

    return distanceFromBottom <= threshold;
  }, [threshold]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const element = containerRef.current;
    if (!element) return;

    element.scrollTo({ top: element.scrollHeight, behavior });

    isFollowingRef.current = true;
    setIsFollowing(true);
    setMissedCount(0);
  }, []);

  /** Attach to the scroll container's `onScroll`. */
  const handleScroll = useCallback(() => {
    const atBottom = measure();

    if (atBottom !== isFollowingRef.current) {
      isFollowingRef.current = atBottom;
      setIsFollowing(atBottom);
    }

    // Catching up clears the backlog indicator.
    if (atBottom) setMissedCount(0);
  }, [measure]);

  /**
   * Call when the rendered message count changes.
   *
   * `isOwnMessage` overrides the follow check — see the rules above.
   */
  const onContentChange = useCallback(
    ({ isOwnMessage = false }: { isOwnMessage?: boolean } = {}) => {
      if (isOwnMessage || isFollowingRef.current) {
        scrollToBottom("smooth");
      } else {
        setMissedCount((count) => count + 1);
      }
    },
    [scrollToBottom],
  );

  /** Jump to the bottom with no animation, for conversation switches. */
  const jumpToBottom = useCallback(() => {
    scrollToBottom("auto");
  }, [scrollToBottom]);

  return {
    containerRef,
    handleScroll,
    /** True when the viewport is at (or near) the newest message. */
    isFollowing,
    /** Messages that arrived while the user was reading further up. */
    missedCount,
    scrollToBottom,
    jumpToBottom,
    onContentChange,
  };
}

/**
 * Runs `jump` whenever `key` changes — used to land at the bottom of a freshly
 * opened conversation before the browser paints, so there is no visible scroll
 * from top to bottom.
 */
export function useJumpOnKeyChange(key: string, jump: () => void) {
  useLayoutEffect(() => {
    jump();
    // Intentionally keyed only on `key`: re-running when `jump` changes identity
    // would fight the user's own scrolling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

/**
 * Re-runs `effect` when `count` increases, ignoring decreases.
 *
 * Message counts can drop legitimately — an optimistic bubble moves from the
 * outbox into history — and that must not be mistaken for new arrivals.
 */
export function useOnCountIncrease(
  count: number,
  effect: (delta: number) => void,
) {
  const previousRef = useRef(count);

  useEffect(() => {
    const previous = previousRef.current;
    previousRef.current = count;

    if (count > previous) effect(count - previous);
  }, [count, effect]);
}
