"use client";

import { useCallback, useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { NAV_SCROLL_OFFSET, SECTION_IDS } from "@/lib/sections";

/**
 * Scrolls to a section, going through Lenis rather than the browser.
 *
 * This has to use `lenis.scrollTo`. The marketing layout wraps the page in
 * `ReactLenis root`, which takes over the document scroll — a native `#anchor` jump or
 * `scrollIntoView` fights it and produces either a hard jump that Lenis then
 * re-animates from the wrong place, or no movement at all. Going through Lenis keeps
 * one animation in charge.
 *
 * Falls back to `scrollIntoView` if Lenis isn't mounted, so the nav still works if the
 * provider is ever removed.
 */
export function useScrollToSection() {
  const lenis = useLenis();

  return useCallback(
    (sectionId: string) => {
      const target = document.getElementById(sectionId);
      if (!target) return;

      if (lenis) {
        lenis.scrollTo(target, {
          offset: NAV_SCROLL_OFFSET,
          duration: 1.1,
        });
        return;
      }

      const top =
        target.getBoundingClientRect().top + window.scrollY + NAV_SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    },
    [lenis],
  );
}

/**
 * Tracks which section is currently in view, for highlighting the active nav item.
 *
 * Uses an IntersectionObserver rather than reading scroll position on every frame:
 * the browser does the intersection work off the main thread, which matters on a page
 * this animation-heavy.
 *
 * `rootMargin` shifts the detection band to the upper-middle of the viewport, so a
 * section counts as "current" when it dominates the screen rather than the instant its
 * first pixel appears at the bottom.
 */
export function useActiveSection(): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Several sections can be intersecting at once on a tall viewport; the one
        // occupying the most of the band wins.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return activeId;
}
