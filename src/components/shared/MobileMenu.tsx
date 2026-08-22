"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { X } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { LANDING_SECTIONS } from "@/lib/sections";
import { useActiveSection, useScrollToSection } from "@/hooks/use-section-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// ─── Responsive tokens ────────────────────────────────────────────────────────
const PANEL = {
  edgeGap: 12,
  maxWidth: 560,
  radius: 28,
} as const;

const PX = "px-6 sm:px-8";
const NAV_FONT = "clamp(1.5rem, 5.5vw, 2.5rem)";

const SOCIALS = [
  { label: "Twitter", href: "https://twitter.com", icon: "𝕏" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
  { label: "Instagram", href: "https://instagram.com", icon: "◎" },
  { label: "Dribbble", href: "https://dribbble.com", icon: "◍" },
];

type Easing = [number, number, number, number];
const EASE_IN: Easing = [0.76, 0, 0.24, 1];
const EASE_OUT: Easing = [0.22, 1, 0.36, 1];

const containerVariants = {
  button: {
    clipPath: "inset(0% 0% 93% 75% round 999px)",
    transition: { duration: 0.52, ease: EASE_IN },
  },
  panel: {
    clipPath: `inset(0% 0% 0% 0% round ${PANEL.radius}px)`,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

const navListVariants = {
  hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 as const } },
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -20, transition: { duration: 0.2, ease: EASE_IN } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};

const footerVariants = {
  hidden: { opacity: 0, y: 14, transition: { duration: 0.18, ease: EASE_IN } },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: EASE_OUT, delay: 0.32 },
  },
};

/**
 * Mobile navigation for the single-page landing.
 *
 * Three changes from the multi-page version:
 *
 * - **Always available.** It used to appear only after scrolling 60px, which left the
 *   top of the page with no mobile navigation at all. On a single page the menu *is*
 *   the navigation, so it's present from the first frame.
 * - **Sections, not routes.** The nested route dropdowns are gone; every entry scrolls
 *   to a section and closes the panel.
 * - **Scroll lock goes through Lenis.** Setting `body { overflow: hidden }` doesn't stop
 *   Lenis, which drives scroll with transforms — the page would keep moving behind the
 *   open panel. `lenis.stop()` actually holds it.
 */
export default function MobileMenu({ scrolled }: { scrolled: boolean }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  const lenis = useLenis();
  const activeSection = useActiveSection();
  const scrollToSection = useScrollToSection();

  const handleClose = useCallback(() => {
    setNavVisible(false);
    setTimeout(() => setPanelOpen(false), 280);
  }, []);

  const handleOpen = () => {
    setPanelOpen(true);
    setTimeout(() => setNavVisible(true), 560);
  };

  const handleSelect = (sectionId: string) => {
    handleClose();
    // Wait for the panel to finish collapsing before scrolling, so the movement isn't
    // hidden behind a closing overlay.
    setTimeout(() => scrollToSection(sectionId), 300);
  };

  // Hold the page while the panel is open. Lenis drives scroll itself, so an
  // `overflow: hidden` on body wouldn't stop it.
  useEffect(() => {
    if (!lenis) return;

    if (panelOpen) lenis.stop();
    else lenis.start();

    return () => lenis.start();
  }, [panelOpen, lenis]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && panelOpen) handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [panelOpen, handleClose]);

  const panelWidth = `min(${PANEL.maxWidth}px, calc(100vw - ${PANEL.edgeGap * 2}px))`;
  const panelHeight = `calc(100vh - ${PANEL.edgeGap * 2}px)`;

  return (
    <div
      className="fixed z-[70] lg:hidden"
      style={{
        top: PANEL.edgeGap,
        right: PANEL.edgeGap,
        width: panelWidth,
        height: panelHeight,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[-1] bg-black/30 backdrop-blur-sm"
            style={{ pointerEvents: "auto" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <motion.div
        className="absolute top-0 right-0 h-full w-full overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #f6f7f9 0%, #eceef1 100%)",
          borderRadius: PANEL.radius,
          boxShadow: panelOpen
            ? "0 32px 80px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.08)"
            : "0 2px 12px rgba(0,0,0,0.10)",
          pointerEvents: "auto",
        }}
        variants={containerVariants}
        initial="button"
        animate={panelOpen ? "panel" : "button"}
      >
        <AnimatePresence>
          {!panelOpen && (
            <motion.button
              key="trigger-btn"
              onClick={handleOpen}
              aria-label="Open menu"
              aria-expanded={panelOpen}
              className={cn(
                "absolute top-0 right-0 flex items-center justify-center gap-2",
                "font-body font-medium text-neutral-900",
              )}
              style={{ width: "25%", height: "7%" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1, delay: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              whileTap={{ scale: 0.94 }}
            >
              <svg className="size-6" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.85" />
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.85" />
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4" />
                <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.4" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {panelOpen && (
            <motion.div
              key="panel-body"
              className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.18, delay: 0.28 } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
            >
              <div
                className={`flex shrink-0 items-center justify-between ${PX} pt-6 pb-2 sm:pt-8`}
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-[5px] bg-blue-600">
                    <span className="size-3 rounded-[2px] bg-white" />
                  </span>
                  <span className="font-body text-base font-semibold tracking-wide text-neutral-900">
                    {SITE_NAME}
                  </span>
                </div>

                <motion.button
                  onClick={handleClose}
                  aria-label="Close menu"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/5"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="size-5 transition-transform duration-300 hover:rotate-90" />
                </motion.button>
              </div>

              <motion.div
                className="mx-6 mt-4 mb-2 h-px shrink-0 bg-black/10 sm:mx-8"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ originX: 0 }}
                transition={{ delay: 0.1, duration: 0.45, ease: EASE_OUT }}
              />

              <nav className="min-h-0 flex-1">
                <ScrollArea className="h-full">
                  <div className={`${PX} py-2`}>
                    <motion.div
                      variants={navListVariants}
                      initial="hidden"
                      animate={navVisible ? "visible" : "hidden"}
                    >
                      {LANDING_SECTIONS.map((section) => {
                        const isActive = activeSection === section.id;

                        return (
                          <motion.div
                            key={section.id}
                            variants={navItemVariants}
                            className="border-b border-black/[0.07] last:border-0"
                          >
                            <button
                              type="button"
                              onClick={() => handleSelect(section.id)}
                              className={cn(
                                "group flex w-full items-center justify-between py-2.5 text-left",
                                "font-body font-black tracking-tight transition-all duration-300",
                                isActive
                                  ? "text-blue-600"
                                  : "text-neutral-900 hover:translate-x-1.5 hover:text-blue-600",
                              )}
                              style={{ fontSize: NAV_FONT }}
                            >
                              <span className="leading-none">{section.label}</span>
                              {isActive && (
                                <span className="size-1.5 shrink-0 rounded-full bg-blue-600" />
                              )}
                            </button>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                </ScrollArea>
              </nav>

              <motion.div
                className={`${PX} shrink-0 pt-4 pb-6 sm:pb-8`}
                variants={footerVariants}
                initial="hidden"
                animate={navVisible ? "visible" : "hidden"}
              >
                <div className="mb-5 h-px bg-black/10" />
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {SOCIALS.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-1.5 text-neutral-600 transition-colors duration-200 hover:text-neutral-950"
                    >
                      <span className="w-4 text-center font-mono text-xs font-bold text-neutral-400 transition-colors group-hover:text-neutral-700">
                        {social.icon}
                      </span>
                      <span className="font-body text-sm font-medium tracking-wide">
                        {social.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
