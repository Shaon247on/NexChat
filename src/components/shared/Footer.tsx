"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollAnimatedText } from "./ScrollAnimatedText";
import { NAV_SECTIONS } from "@/lib/sections";
import { SITE_EMAIL, SITE_NAME } from "@/lib/constants";
import { useScrollToSection } from "@/hooks/use-section-nav";

const socialLinks = [
  { label: "Twitter", href: "https://twitter.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Linkedin", href: "https://linkedin.com" },
  { label: "Behance", href: "https://behance.net" },
  { label: "Dribbble", href: "https://dribbble.com" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const scrollToSection = useScrollToSection();

  return (
    <footer className="relative mx-auto mt-10 mb-2 max-w-420 rounded-2xl bg-black shadow-2xl">
      <div
        className="w-full overflow-hidden"
        style={{
          borderRadius: "16px 16px 0 0",
          background: "#0f0f0f",
        }}
      >
        <div className="px-8 pt-12 pb-10 md:px-12 lg:px-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
            <div className="flex max-w-xs flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px]"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <div
                    className="h-2.5 w-2.5 rounded-[2px]"
                    style={{ background: "#fff" }}
                  />
                </div>
                <span
                  className="text-sm font-medium tracking-wide text-white"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {SITE_NAME}
                </span>
              </div>

              <ScrollAnimatedText
                title="Start a conversation in seconds"
                className="max-w-4xl text-5xl"
                transformedColor="#FFFFFF"
              />

              <p className="-mt-20 text-xs leading-relaxed text-gray-600">
                No password, no sign-up form.
                <br />
                Just your number and a name.
              </p>
            </div>

            <div className="flex flex-col gap-5 text-gray-400 lg:items-end">
              <a
                href={`mailto:${SITE_EMAIL}`}
                className="font-medium transition-opacity duration-200 hover:opacity-70"
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                  color: "#ffffff",
                  letterSpacing: "-0.01em",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.25)",
                  paddingBottom: "2px",
                }}
              >
                {SITE_EMAIL}
              </a>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                {socialLinks.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1 px-3 py-1 text-xs transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      color: "rgba(255,255,255,0.5)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.03)",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(255,255,255,0.85)";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(255,255,255,0.5)";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.1)";
                    }}
                  >
                    {s.label}
                    <span style={{ fontSize: "9px", opacity: 0.5 }}>↗</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="mx-8 md:mx-12 lg:mx-16"
          style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
        />

        <div className="px-8 py-10 md:px-12 lg:px-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-3">
              <p
                className="mb-2 text-xs uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.15em",
                }}
              >
                Navigation
              </p>
              <div className="grid grid-cols-2 gap-x-16 gap-y-2.5">
                {NAV_SECTIONS.map((section) => (
                  <SectionLink
                    key={section.id}
                    label={section.label}
                    onSelect={() => scrollToSection(section.id)}
                  />
                ))}
              </div>
            </div>

            <div className="overflow-hidden lg:text-right">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="leading-none text-white select-none"
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "clamp(3.5rem, 9vw, 8rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                }}
              >
                {SITE_NAME}
                <sup
                  style={{
                    fontSize: "0.3em",
                    verticalAlign: "super",
                    opacity: 0.7,
                    letterSpacing: 0,
                  }}
                >
                  ®
                </sup>
              </motion.p>
            </div>
          </div>
        </div>

        <div
          className="mx-8 md:mx-12 lg:mx-16"
          style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
        />

        <div className="px-8 py-5 md:px-12 lg:px-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <span
              className="text-xs"
              style={{
                fontFamily: "var(--font-dm-sans)",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              {SITE_NAME} © {year}
            </span>

            {/*
              Was a list of per-service pages. Those routes don't exist in the
              single-page site, so it's now the one genuine outbound destination:
              the app itself.
            */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href="/login"
                className="flex items-center gap-1 text-xs transition-opacity duration-200 hover:opacity-80"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  color: "rgba(255,255,255,0.35)",
                  textDecoration: "none",
                }}
              >
                Sign in
                <span style={{ fontSize: "9px", opacity: 0.5 }}>↗</span>
              </Link>
              <Link
                href="/chat"
                className="flex items-center gap-1 text-xs transition-opacity duration-200 hover:opacity-80"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  color: "rgba(255,255,255,0.35)",
                  textDecoration: "none",
                }}
              >
                Open the app
                <span style={{ fontSize: "9px", opacity: 0.5 }}>↗</span>
              </Link>
            </div>

            <span
              className="text-xs whitespace-nowrap"
              style={{
                fontFamily: "var(--font-dm-sans)",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              [ Since 2012 ]
            </span>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "120px",
          background:
            "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(0,0,0,0.9) 0%, transparent 100%)",
        }}
      />
    </footer>
  );
}

/**
 * Footer nav entry. A button rather than a link, because these are sections on this
 * page and scrolling has to go through Lenis — a native anchor jump fights it.
 */
function SectionLink({
  label,
  onSelect,
}: {
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-fit items-center gap-1 text-left text-sm text-white/50 transition-colors duration-200 hover:text-white/90 hover:underline hover:underline-offset-[3px]"
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      {label}
      <span className="ml-0.5 text-[10px] opacity-0 transition-opacity duration-200 group-hover:opacity-60">
        ↓
      </span>
    </button>
  );
}