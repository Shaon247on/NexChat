"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Parallax from "../../shared/parallax";

/* ─────────────────────────────────────────────────
   Utility: smooth spring wrapper around a motion val
───────────────────────────────────────────────────*/
import type { MotionValue } from "framer-motion";
import { ScrollAnimatedText } from "@/components/shared/ScrollAnimatedText";
import TitleSection from "@/components/element/TitleSection";
import { Button } from "@/components/ui/button";
import CountUp from "@/components/element/CountUp";
import Link from "next/link";

function useSmoothTransform(
  value: MotionValue<number>,
  stiffness = 60,
  damping = 20,
) {
  return useSpring(value, { stiffness, damping, mass: 0.4 });
}

/* ─────────────────────────────────────────────────
   Stat pill
───────────────────────────────────────────────────*/
function Stat({
  value,
  label,
  delay = 0,
}: {
  value: string;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-1"
    >
      <span className="text-3xl md:text-4xl font-black tracking-tight text-neutral-950">
        {value}
      </span>
      <span className="text-xs text-neutral-400 tracking-widest uppercase">
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────
   Word-by-word reveal paragraph
───────────────────────────────────────────────────*/
function RevealText({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.28em] text-lg"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.65,
            delay: delay + i * 0.025,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

/* ─────────────────────────────────────────────────
   Floating label badge
───────────────────────────────────────────────────*/
function Badge({ text, delay = 0 }: { text: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-[11px] font-medium tracking-wide text-neutral-600 shadow-sm"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
      {text}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────
   Main Section
───────────────────────────────────────────────────*/
export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Gentle horizontal drift for decorative line
  const lineWidth = useSmoothTransform(
    useTransform<number, number>(scrollYProgress, [0.05, 0.3], [0, 1]),
    80,
    25,
  );

  // Large headline parallax drift
  const headlineY = useSmoothTransform(
    useTransform<number, number>(scrollYProgress, [0, 0.5], [60, -20]),
    50,
    18,
  );

  // Right image: subtle upward float
  const rightImgY = useSmoothTransform(
    useTransform<number, number>(scrollYProgress, [0.1, 0.8], [40, -40]),
    55,
    20,
  );

  // Left small image: opposite direction
  const leftImgY = useSmoothTransform(
    useTransform<number, number>(scrollYProgress, [0.1, 0.8], [-20, 40]),
    55,
    20,
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24 md:py-32 lg:py-40"
    >
      {/* ── Decorative background text ── */}
      <TitleSection
        topClassName="top-5 lg:top-0"
        title="The product"
        scrollYProgress={scrollYProgress}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-20 md:mb-28">
          <ScrollAnimatedText
            title="A messenger that gets out of the way and lets you talk."
            className="text-7xl max-w-3xl"
          />
        </div>

        {/* ══════════════════════════════════════
            ROW 2 — Images + Story text
        ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start mb-24 md:mb-32">
          {/* Left column: stacked images */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Main tall image */}
            <Parallax
              className="relative w-full overflow-hidden rounded-2xl bg-neutral-200 hidden lg:block"
              contentClassName="w-full h-full"
              effect="translate"
              axis="y"
              range={[-18, 18]}
              smooth
              style={{ aspectRatio: "4/5" }}
            >
              <motion.div
                className="relative w-full h-full "
                style={{ y: rightImgY }}
              >
                <Image
                  src="https://i.pinimg.com/736x/7a/3c/70/7a3c70d950bf959bcc3278c66e0a52f7.jpg"
                  alt="Our studio"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Warm tint overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

                {/* Floating badge over image */}
                <div className="absolute bottom-5 left-5">
                  <Badge text="Creative Studio" delay={0.6} />
                </div>
              </motion.div>
            </Parallax>

            {/* Small landscape image */}
            <motion.div
              className="relative w-full overflow-hidden rounded-2xl bg-neutral-200"
              style={{ y: leftImgY, aspectRatio: "16/9" }}
            >
              <Image
                src="https://i.pinimg.com/736x/88/76/c3/8876c3d6cc492465a91cea742febdc9e.jpg"
                alt="Our process"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-br from-orange-600/10 via-transparent to-transparent" />
            </motion.div>
          </div>

          {/* Right column: story text + stats */}
          <div className="lg:col-span-7 lg:pl-10 flex flex-col justify-between h-full pt-4 lg:pt-10">
            {/* Story paragraphs */}
            <div className="space-y-8">
              <RevealText
                text="NexChat is built around one idea: the fastest way to reach someone shouldn't need an account, a password, or an invite. Enter your number, pick a name, and you're in — the app decides whether that's a sign-up or a sign-in so you don't have to."
                className="text-base md:text-2xl text-neutral-600 leading-7 font-semibold max-w-xl"
                delay={0.1}
              />

              <RevealText
                text="From there it's a proper messenger. Direct threads and group conversations share the same panel, messages arrive live, and every state you can end up in — sending, delivered, failed, empty, offline — is something the interface actually says out loud."
                className="text-base md:text-2xl text-neutral-600 leading-7 font-semibold max-w-xl"
                delay={0.2}
              />
            </div>

            {/* Values list */}
            <div className="space-y-0 flex-1 mt-10 xl:mt-20 mb-16 border-t border-neutral-200">
              {[
                {
                  label: "Strategy first",
                  desc: "Every decision begins with understanding.",
                },
                {
                  label: "Craft obsessed",
                  desc: "Details are the design, not decoration.",
                },
                {
                  label: "Built to last",
                  desc: "We build for the next decade, not the next trend.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.65,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group flex items-center justify-between py-3 xl:py-5 border-b border-neutral-200 cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <motion.span className="text-xs font-mono text-neutral-300 group-hover:text-orange-500 transition-colors duration-300">
                      0{i + 1}
                    </motion.span>
                    <span className="text-sm font-semibold text-neutral-800 group-hover:text-orange-600 transition-colors duration-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 max-w-50 text-right leading-snug hidden sm:block">
                    {item.desc}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2,
              }}
            >
              <Link href={"/login"}>
              <Button
                size={"lg"}
                className="h-auto gap-2.5 px-7 py-3.5 font-body text-sm font-semibold"
              >
                Meet the team
                <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            ROW 3 — Stats bar
        ══════════════════════════════════════ */}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-neutral-950 px-8 md:px-12 py-10 md:py-12 overflow-hidden"
      >
        {/* Subtle orange glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-orange-600/10 blur-3xl" />

        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {[
            { value: 38, suffix: "+", label: "Projects delivered" },
            { value: 12, suffix: "", label: "Years of craft" },
            { value: 94, suffix: "%", label: "Client retention" },
            { value: 6, suffix: "", label: "Industry awards" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="text-3xl md:text-4xl font-black tracking-tight text-white">
                <CountUp
                  from={0}
                  to={s.value}
                  separator=","
                  direction="up"
                  duration={1.4}
                  className="inline"
                />
                <span>{s.suffix}</span>
              </div>

              <span className="text-xs text-neutral-500 tracking-widest uppercase">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
