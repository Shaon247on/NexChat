"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";
import { NAV_SECTIONS } from "@/lib/sections";
import { useActiveSection, useScrollToSection } from "@/hooks/use-section-nav";
import MobileMenu from "./MobileMenu";

/**
 * Single-page section nav.
 *
 * Two deliberate changes from the previous multi-page navbar:
 *
 * 1. **It stays visible while scrolling.** The old navbar hid itself past 60px, which
 *    is fine when links are routes but useless for section navigation — the nav is
 *    exactly what you want available *while* moving through the page. It compacts
 *    instead of disappearing.
 * 2. **Colour follows the background, not the route.** The hero is dark and everything
 *    below it is light, so the nav is white-on-transparent over the hero and
 *    dark-on-frosted once past it. Previously this was keyed off `pathname === "/"`,
 *    which no longer means anything on a single page.
 *
 * Clicks go through Lenis (see `useScrollToSection`) because Lenis owns the document
 * scroll and a native anchor jump would fight it.
 */
export default function ScrollNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection();
  const scrollToSection = useScrollToSection();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Over the dark hero the nav is light; past it, dark on a frosted surface.
  const onDarkHero = !scrolled;

  return (
    <>
      <motion.header
        className="pointer-events-none fixed top-0 right-0 left-0 z-50 flex items-center justify-between gap-4 px-5 pt-5"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        <button
          type="button"
          onClick={() => scrollToSection("hero")}
          aria-label={`${SITE_NAME} — back to top`}
          className="pointer-events-auto flex shrink-0 items-center gap-2"
        >
          <span className="relative size-7 shrink-0">
            <Image
              src="/fav-icon.png"
              alt=""
              fill
              className="object-contain"
            />
          </span>
          <span
            className={cn(
              "font-body text-base font-semibold tracking-wide transition-colors duration-300",
              onDarkHero ? "text-white" : "text-neutral-950",
            )}
          >
            {SITE_NAME}
          </span>
        </button>

        <nav
          className={cn(
            "pointer-events-auto hidden items-center gap-0.5 rounded-full border px-2 py-1.5 transition-all duration-300 lg:flex",
            onDarkHero
              ? "border-white/25 bg-white/10 backdrop-blur-md"
              : "border-neutral-200 bg-white/85 shadow-sm backdrop-blur-md",
          )}
        >
          {NAV_SECTIONS.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-1.5 font-body text-sm font-medium transition-colors duration-200",
                  onDarkHero
                    ? isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                    : isActive
                      ? "text-white"
                      : "text-neutral-600 hover:text-neutral-950",
                )}
              >
                {/*
                  A shared layoutId gives the active pill a single animated element that
                  slides between items, instead of one fading out while another fades in.
                */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className={cn(
                      "absolute inset-0 rounded-full",
                      onDarkHero ? "bg-white/25" : "bg-blue-600",
                    )}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{section.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="hidden shrink-0 lg:block">
          {/*
            The one genuinely outbound destination on the page. Was a scroll to a
            "get-started" section; that section is gone, so it goes to the app.
          */}
          <Link
            href="/login"
            className="pointer-events-auto inline-block rounded-full bg-blue-600 px-5 py-2.5 font-body text-sm font-semibold text-white shadow-[0_1px_3px_rgba(37,99,235,0.4)] transition-all duration-200 hover:bg-blue-700 hover:shadow-[0_4px_16px_rgba(37,99,235,0.45)]"
          >
            Start messaging
          </Link>
        </div>

        {/* Spacer so the nav stays optically centred on smaller screens. */}
        <div className="w-8 shrink-0 lg:hidden" />
      </motion.header>

      <MobileMenu scrolled={scrolled} />
    </>
  );
}
