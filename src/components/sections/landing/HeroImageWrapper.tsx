"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Parallax from "../../shared/parallax";

export default function HeroImageWrapper() {
  const mouseX = useMotionValue(100);
  const mouseY = useMotionValue(100);

  const springCfg = { stiffness: 28, damping: 20, mass: 1.6 };
  const smoothX = useSpring(mouseX, springCfg);
  const smoothY = useSpring(mouseY, springCfg);

  const imageX = useTransform(smoothX, [0, 1], [-8, 8]);
  const imageY = useTransform(smoothY, [0, 1], [-5, 5]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* ── Base blue background — deep navy, mimics the orange base in reference ── */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "#050d2e" }}
        aria-hidden="true"
      />

      {/* ── Radial glow zones — layered blue shades like the orange zones in reference ── */}

      {/* Center-right bright royal blue zone (mimics the vivid orange center) */}
      <div
        className="absolute inset-0 z-1"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 62% 48%, rgba(30,90,220,0.72) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Mid electric blue — adds the "hot spot" depth */}
      <div
        className="absolute inset-0 z-1"
        style={{
          background:
            "radial-gradient(ellipse 45% 50% at 58% 44%, rgba(60,130,255,0.45) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* Left-side deeper indigo fade (like left dark-orange shadow in reference) */}
      <div
        className="absolute inset-0 z-1"
        style={{
          background:
            "radial-gradient(ellipse 55% 80% at 15% 50%, rgba(10,30,100,0.85) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      {/* Right-side indigo fade */}
      <div
        className="absolute inset-0 z-1"
        style={{
          background:
            "radial-gradient(ellipse 45% 80% at 95% 50%, rgba(8,20,80,0.80) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Top-center cobalt bloom — like the upper orange warmth bleeding in */}
      <div
        className="absolute inset-0 z-1"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 55% 0%, rgba(20,60,180,0.55) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Bottom deep navy pool — like the dark base of the reference */}
      <div
        className="absolute inset-0 z-1"
        style={{
          background:
            "radial-gradient(ellipse 80% 35% at 50% 100%, rgba(3,8,30,0.90) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── Animated hero image with parallax ── */}
      <motion.div
        className="absolute inset-0 z-2"
        style={{ x: imageX, y: imageY, scale: 1.04 }}
      >
        <Parallax
          className="h-full w-full"
          contentClassName="h-full w-full"
          range={[-80, 80]}
          axis="y"
        >
          <Image
            src="/hero.png"
            alt="Hero"
            fill
            className="object-contain object-center max-h-[85vh] my-auto"
            priority
          />
        </Parallax>
      </motion.div>
    </>
  );
}
