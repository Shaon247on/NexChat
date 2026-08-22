"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { motion, animate } from "framer-motion";
import { SITE_EMAIL, HERO_SERVICES, SITE_TAGLINE } from "@/lib/constants";
import { useScrollToSection } from "@/hooks/use-section-nav";
import HeroImageWrapper from "./HeroImageWrapper";
import { Button } from "../../ui/button";

// ─────────────────────────────────────────
// Animated counter
// ─────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    const ctrl = animate(0, to, {
      duration: 2.2,
      ease: "easeOut",
      delay: 1.4,
      onUpdate: (v) => setVal(Math.round(v)),
    });

    return () => ctrl.stop();
  }, [to]);

  return (
    <span>
      {val}
      {suffix}
    </span>
  );
}

// ─────────────────────────────────────────
// Glitch text (fires periodically)
// ─────────────────────────────────────────
function GlitchWord({ children }: { children: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOn(true);

      const timeoutId = setTimeout(() => setOn(false), 200);

      // cleanup nested timeout if component unmounts during cycle
      return () => clearTimeout(timeoutId);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <span className="relative inline-block">
      {children}
      {on && (
        <>
          <span
            className="pointer-events-none absolute inset-0 select-none text-blue-400"
            style={{
              clipPath: "inset(15% 0 55% 0)",
              transform: "translate(-3px,0)",
              mixBlendMode: "screen",
            }}
            aria-hidden
          >
            {children}
          </span>
          <span
            className="pointer-events-none absolute inset-0 select-none text-cyan-300"
            style={{
              clipPath: "inset(55% 0 10% 0)",
              transform: "translate(3px,0)",
              mixBlendMode: "screen",
            }}
            aria-hidden
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
}

// ─────────────────────────────────────────
// Scan-line sweeping vertically
// ─────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 right-0 z-4 h-px"
      style={{
        background:
          "linear-gradient(to right,transparent,rgba(80,160,255,0.18),transparent)",
      }}
      animate={{ top: ["0%", "100%"] }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 3,
      }}
      aria-hidden
    />
  );
}

// ─────────────────────────────────────────
// Subtle perspective grid
// ─────────────────────────────────────────
function GridLines() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5, delay: 0.6 }}
      style={{
        backgroundImage: `
          linear-gradient(rgba(40,100,255,0.035) 1px,transparent 1px),
          linear-gradient(90deg,rgba(40,100,255,0.035) 1px,transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
      aria-hidden
    />
  );
}

// ─────────────────────────────────────────
// Ambient floating orb
// ─────────────────────────────────────────
function Orb({
  style,
  delay = 0,
  duration = 6,
}: {
  style: CSSProperties;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute z-2 rounded-full blur-3xl"
      style={style}
      animate={{ y: [0, -20, 0], opacity: [0.35, 0.6, 0.35] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      aria-hidden
    />
  );
}

// ─────────────────────────────────────────
// Framer variants
// ─────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.4,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: 48 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

// ─────────────────────────────────────────
// Main Section
// ─────────────────────────────────────────
export default function HeroSection() {
  // The site is a single page plus the app, so "explore" scrolls rather than routes.
  const scrollToSection = useScrollToSection();

  return (
    <section
      className="relative h-screen min-h-175 w-full overflow-hidden"
      aria-label="Hero"
    >
      <HeroImageWrapper />
      <GridLines />
      <ScanLine />

      <Orb
        delay={0}
        duration={7}
        style={{
          top: "15%",
          left: "6%",
          width: 220,
          height: 220,
          background: "rgba(20,80,220,0.18)",
        }}
      />
      <Orb
        delay={2}
        duration={9}
        style={{
          top: "28%",
          right: "10%",
          width: 280,
          height: 280,
          background: "rgba(50,120,255,0.13)",
        }}
      />
      <Orb
        delay={4}
        duration={6}
        style={{
          bottom: "22%",
          left: "22%",
          width: 160,
          height: 160,
          background: "rgba(100,180,255,0.10)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-3"
        style={{
          background:
            "linear-gradient(to right,rgba(3,8,28,0.82) 0%,transparent 14%,transparent 86%,rgba(3,8,28,0.82) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-3 h-72"
        style={{
          background:
            "linear-gradient(to top,rgba(3,8,28,0.97) 0%,rgba(5,12,40,0.55) 55%,transparent 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-3 h-44"
        style={{
          background:
            "linear-gradient(to bottom,rgba(3,8,28,0.72) 0%,transparent 100%)",
        }}
        aria-hidden
      />

      <motion.aside
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-0 left-0 top-0 z-10 flex w-13 flex-col items-center justify-between py-8"
        style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
        aria-hidden="true"
      >
        <div className="mt-24" />

        <div className="mb-4">
          <span
            className="font-body whitespace-nowrap text-[10px] tracking-[0.22em] text-white/22"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {SITE_EMAIL}
          </span>
        </div>
      </motion.aside>

      <motion.aside
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-0 right-0 top-0 z-10 hidden w-13 flex-col items-center justify-center lg:flex"
        style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
        aria-hidden="true"
      >
        <span
          className="font-body whitespace-nowrap text-[10px] tracking-[0.22em] text-white/18"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {SITE_TAGLINE}
        </span>
      </motion.aside>

      <div className="absolute inset-0 z-6 flex flex-col pl-13 lg:pr-13">
        <div className="h-20 shrink-0" />

        <div className="flex flex-1 items-center px-6 pb-16 lg:px-12 mt-60">
          <div className="mx-auto text-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col lg:col-span-7"
            >
              <motion.h1
                variants={fadeUp}
                className="mb-6 font-body text-white uppercase leading-none tracking-[-0.025em]"
                style={{
                  fontSize: "clamp(2.6rem, 6.2vw, 5.8rem)",
                  fontWeight: 900,
                }}
              >
                <GlitchWord>Message anyone</GlitchWord>
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(100deg,#60a5fa 0%,#a78bfa 50%,#38bdf8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  instantly.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mb-8 max-w-115 mx-auto font-body text-[0.95rem] leading-relaxed text-white/40"
                style={{ fontWeight: 300 }}
              >
                Sign in with your phone number — no password, no sign-up form.
                Find anyone by name and start talking, one to one or in a group,
                with messages that arrive the moment they&apos;re sent.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mb-10 flex flex-wrap items-center justify-center gap-4"
              >
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => scrollToSection("features")}
                  className="h-auto gap-2.5 px-7 py-3.5 font-body text-sm font-semibold"
                >
                  See what it does
                  <svg
                    className="h-3.5 w-3.5 rotate-45"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="flex h-auto gap-2.5 px-7 py-3.5 font-body text-sm font-medium text-white/85 hover:text-white"
                  style={
                    {
                      background: "rgba(12,28,90,0.55)",
                      border: "1px solid rgba(80,130,255,0.28)",
                      "--tw-before-bg": "rgba(20,50,140,0.65)",
                    } as CSSProperties
                  }
                >
                  <Link href="/login" className="flex items-center gap-3">
                    Start messaging
                    <svg
                      className="h-3.5 w-3.5 rotate-45"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 17L17 7M17 7H7M17 7v10"
                      />
                    </svg>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="hidden flex-col gap-4 lg:col-span-5 lg:flex"
            ></motion.div>
          </div>
        </div>

        <div className="h-15 shrink-0" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.1 }}
        className="absolute bottom-0 left-1/2 z-8 flex -translate-x-1/2 items-center gap-8 px-6 py-4 lg:px-12"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        {HERO_SERVICES.map((service, i) => (
          <motion.div
            key={service.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 + i * 0.08 }}
          >
            <Button
              variant="link"
              onClick={() => scrollToSection("features")}
              className="group flex shrink-0 items-center gap-2"
            >
              <span className="size-2 rounded-full bg-blue-500/55 transition-colors group-hover:bg-blue-400" />
              <span className="font-body text-base tracking-wide text-white/52 transition-colors group-hover:text-white/75">
                {service.label}
              </span>
              <svg
                className="size-4 text-white/14 transition-colors group-hover:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 17L17 7M17 7H7M17 7v10"
                />
              </svg>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
