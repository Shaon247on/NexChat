"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

const IMAGE_URL =
  "https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg";

export default function LetsCreate() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // Scroll relative to the whole section passing through viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  // The image shifts opposite to scroll — parallax
  // Since image is 100vh tall and pinned, we shift it so it tracks
  // the window's position on screen
  const imageY = useTransform(smooth, [0, 1], ["10%", "0%"]);

  // Subtle scale pop as it scrolls into view
  const imageScale = useTransform(smooth, [0, 0.5, 1], [1.05, 1.0, 1.05]);

  // Content fades in as section enters center of viewport
  const contentOpacity = useTransform(
    smooth,
    [0.1, 0.3, 0.75, 0.9],
    [0, 1, 1, 0],
  );
  const contentY = useTransform(smooth, [0.1, 0.3], ["24px", "0px"]);

  // Overlay lightens slightly at peak
  const overlayOpacity = useTransform(smooth, [0, 0.4, 1], [0.7, 0.45, 0.65]);

  return (
    <section
      ref={sectionRef}
      className="relative my-10"
      // Tall enough to give scroll runway — image window effect needs space
      style={{ height: "150vh" }}
    >
      {/* Sticky container — this is the "window" that stays on screen */}
      <div className="sticky top-[12vh] w-full" style={{ height: "70vh" }}>
        {/* The window frame — clips everything inside */}
        <div ref={windowRef} className="relative w-full h-full overflow-hidden">
          {/*
            Image container — full viewport height, positioned so the
            visible slice through the window matches scroll position.
            `objectPosition` + `imageY` creates the porthole illusion.
          */}
          <motion.div
            className="absolute inset-x-0"
            style={{
              // Taller than the window so we have room to move
              height: "160%",
              top: "-30%",
              y: imageY,
              scale: imageScale,
            }}
          >
            <Image
              height={1080}
              width={1920}
              src={IMAGE_URL}
              alt="Let's Create Meaning Together"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center center" }}
              draggable={false}
            />
          </motion.div>

          {/* Directional overlay — darker on left, fades right */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: overlayOpacity,
              background:
                "linear-gradient(110deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.15) 100%)",
            }}
          />

          {/* Bottom vignette */}
          <div
            className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
            }}
          />

          {/* Top vignette */}
          <div
            className="absolute inset-x-0 top-0 h-32 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
            }}
          />

          {/* Header bar */}
          <div className="absolute top-0 inset-x-0 flex items-center justify-between px-8 pt-7 z-20">
            <div className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 rounded-[4px] flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.9)" }}
              >
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-[2px]" />
              </div>
              <span
                className="text-white text-sm font-medium tracking-wide"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Nexchat
              </span>
            </div>

            <div
              className="text-white/60 text-xs tracking-widest border border-white/15 rounded-full px-4 py-1.5"
              style={{
                fontFamily: "var(--font-dm-sans)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              Local time:{" "}
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </div>
          </div>

          {/* Main content */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-end pb-12 px-10 z-10"
            style={{ opacity: contentOpacity, y: contentY }}
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              {/* Left — headline + CTA */}
              <div className="flex flex-col gap-7">
                <h2
                  className="text-white leading-[0.9] tracking-tight"
                  style={{
                    fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                    fontWeight: 700,
                  }}
                >
                  Let&apos;s Create
                  <br />
                  Meaning Together
                </h2>

                <div className="flex items-center gap-5">
                  <a
                    href="/login"
                    className="group flex items-center gap-3 px-5 py-2.5 text-white text-sm font-medium transition-all duration-300 hover:bg-white/15"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      borderRadius: "6px",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      background: "rgba(255,255,255,0.07)",
                    }}
                  >
                    Book A Call Now
                    <span className="text-white/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 text-xs">
                      ↗
                    </span>
                  </a>

                  <span
                    className="text-white/40 text-xs tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    [ From 8:00 To 16:30 ]
                  </span>
                </div>
              </div>

              {/* Right — descriptor */}
              <p
                className="text-white/45 text-[13px] leading-relaxed max-w-[280px] lg:text-right"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                [ A creative studio crafting bold, user-focused digital
                experiences. At Nexchat, we blend strategy, design, and
                innovation to help brands stand out and grow. ]
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
