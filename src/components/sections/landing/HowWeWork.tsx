"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import BorderGlow from "@/components/element/BorderGlow";
import { ScrollAnimatedText } from "@/components/shared/ScrollAnimatedText";
import Image from "next/image";
import TitleSection from "@/components/element/TitleSection";
import { ScanSearch } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Sign in with your number",
    icon: ScanSearch,
    description:
      "Enter your phone number and a name. If the number is new, your account is created on the spot — there's no separate sign-up and no password.",
    gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    accentColor: "#4f8ef7",
    glowColors: ["#4f8ef7", "#60a5fa", "#93c5fd"],
    glowColor: "220 80 70",
    yOffset: "0px",
  },
  {
    number: "02",
    title: "Find who you're after",
    icon: ScanSearch,
    description:
      "Search the directory by name and pick someone. If you already have a thread with them it opens instantly; if not, a new one starts.",
    gradient: "from-[#0f3460] via-[#1e3a5f] to-[#1a1a2e]",
    accentColor: "#60a5fa",
    glowColors: ["#60a5fa", "#93c5fd", "#bfdbfe"],
    glowColor: "213 85 70",
    yOffset: "64px",
  },
  {
    number: "03",
    title: "Say something",
    icon: ScanSearch,
    description:
      "Your message appears the moment you hit enter and confirms once it lands. If it doesn't, you'll know — nothing is quietly marked as sent.",
    gradient: "from-[#16213e] via-[#1d4ed8] to-[#0f3460]",
    accentColor: "#2563eb",
    glowColors: ["#2563eb", "#3b82f6", "#60a5fa"],
    glowColor: "221 83 60",
    yOffset: "128px",
  },
  {
    number: "04",
    title: "Bring in everyone else",
    icon: ScanSearch,
    description:
      "Add two or more people to start a group. Name it, promote admins, add or remove members — or leave whenever you want.",
    gradient: "from-[#0f3460] via-[#1e40af] to-[#0ea5e9]",
    accentColor: "#0ea5e9",
    glowColors: ["#0ea5e9", "#38bdf8", "#7dd3fc"],
    glowColor: "199 89 60",
    yOffset: "192px",
  },
];

type Step = (typeof steps)[number];

interface StepCardProps {
  step: Step;
  idx: number;
  scrollYProgress: MotionValue<number>;
}

function StepCard({ step, idx, scrollYProgress }: StepCardProps) {
  const start = 0.12 + idx * 0.12;
  const end = start + 0.18;

  const y = useTransform(scrollYProgress, [start, end], [120, 0]);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const scale = useTransform(scrollYProgress, [start, end], [0.92, 1]);

  return (
    <motion.div
      className="flex gap-6 will-change-transform"
      style={{
        marginTop: step.yOffset,
        y,
        opacity,
        scale,
      }}
    >
      <BorderGlow
        colors={step.glowColors}
        glowColor={step.glowColor}
        backgroundColor="transparent"
        borderRadius={55}
        glowRadius={30}
        glowIntensity={1.2}
        className="min-w-22 h-46.25 cursor-pointer"
      >
        <div
          className={`relative w-full h-full rounded-[55px] overflow-hidden bg-linear-to-b ${step.gradient}`}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-40 mix-blend-overlay"
            viewBox="0 0 110 185"
          >
            {[...Array(12)].map((_, i) => (
              <path
                key={i}
                d={`M-20 ${20 + i * 15} Q 30 ${
                  i % 2 === 0 ? 10 : 30
                }, 55 ${20 + i * 15} T 130 ${20 + i * 15}`}
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            ))}
          </svg>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {step.number}
            </span>
          </div>
        </div>
      </BorderGlow>

      <div className="flex flex-col gap-3 max-w-[240px]">
        <h3 className="text-lg font-semibold text-[#111] tracking-tight">
          {step.title}
        </h3>
        <p className="text-[13px] text-[#666] leading-relaxed">
          {step.description}
        </p>

        <div className="relative w-full h-[1px] bg-black/10 mt-2">
          <motion.div
            className="absolute inset-0 bg-black/60 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 0.3 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function ProcessSection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 100%"],
  });

  const imageY = useTransform(scrollYProgress, [0.45, 0.85], [140, 0]);
  const imageOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0.4, 1]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen pt-32 px-6 lg:px-12 overflow-hidden"
    >
      <div className="absolute inset-0 flex justify-between pointer-events-none px-6 lg:px-12">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-[1px] h-full bg-black/[0.04]" />
        ))}
      </div>
      <TitleSection
      title="how we work"
      scrollYProgress={scrollYProgress}
      className="text-6xl md:text-8xl lg:text-9xl xl:text-[12rem]"
      topClassName="top-0"
      />

      <div>
        <ScrollAnimatedText
          title="A structured process built for real-world impact"
          className="max-w-5xl"
        />
      </div>

      <div className="relative max-w-430 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {steps.map((step, idx) => (
          <StepCard
            key={step.number}
            step={step}
            idx={idx}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>

      <div className="relative mt-40 max-w-[1720px] mx-auto flex flex-col md:flex-row items-end gap-12 lg:gap-24 overflow-hidden">
        <div className="relative w-full max-w-[320px] h-[420px] overflow-hidden rounded-3xl">
          <motion.div
            style={{ y: imageY, opacity: imageOpacity }}
            className="absolute inset-x-0 bottom-0"
          >
            <Image
              alt="helmet"
              src="https://i.pinimg.com/736x/39/01/77/3901773766429ea67eb0a646b9d2233f.jpg"
              width={500}
              height={600}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>

        <div className="flex-1 pb-12 flex flex-col gap-6">
          <div className="grid grid-cols-3 w-8 gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full bg-black ${
                  i === 3 ? "opacity-100" : "opacity-40"
                }`}
              />
            ))}
          </div>

          <ScrollAnimatedText
            title="“We combine strategy, design, and technology into a clear, repeatable process - built to reduce risk and maximize results.”"
            className="text-4xl tracking-normal font-normal max-w-xl"
          />
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute bottom-10 right-10 w-12 h-12 rounded-full border border-black/10 flex items-center justify-center bg-white shadow-sm hover:border-black/30 transition-colors duration-300 z-50"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M7 11V3M3 6l4-4 4 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}
