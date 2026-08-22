"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";

interface ScrollAnimatedTextProps {
  title: string;
  subtitle?: string;
  transformedColor?: string;
  href?: string;
  hrefText?: string;
  position?: "text-start" | "text-center" | "text-end";
  className?: string;
  headingClassName?: string;
  subtitleClassName?: string;
  as?: "h1" | "h2" | "h3";
}

function useSmoothTransform(
  value: MotionValue<number>,
  stiffness = 50,
  damping = 18
) {
  return useSpring(value, {
    stiffness,
    damping,
    mass: 0.4,
  });
}

function AnimatedChar({
  char,
  charIndex,
  progress,
  transformedColor,
}: {
  char: string;
  charIndex: number;
  progress: MotionValue<number>;
  transformedColor: string;
}) {
  const x = useTransform(progress, (value) => {
    const charProgress = value - charIndex;
    if (charProgress < 0) return 0;
    if (charProgress > 1) return 8;
    return charProgress * 8;
  });

  const color = useTransform(progress, (value) => {
    const charProgress = value - charIndex;

    const start = { r: 156, g: 163, b: 175 };

    const hex = transformedColor.replace("#", "");
    const end =
      hex.length === 6
        ? {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16),
          }
        : { r: 0, g: 0, b: 0 };

    if (charProgress < 0) {
      return `rgb(${start.r}, ${start.g}, ${start.b})`;
    }

    if (charProgress > 1) {
      return `rgb(${end.r}, ${end.g}, ${end.b})`;
    }

    const r = Math.round(start.r + charProgress * (end.r - start.r));
    const g = Math.round(start.g + charProgress * (end.g - start.g));
    const b = Math.round(start.b + charProgress * (end.b - start.b));

    return `rgb(${r}, ${g}, ${b})`;
  });

  return (
    <motion.span
      style={{
        x,
        height: "1em",
        color,
      }}
      className="inline-block align-baseline will-change-transform"
    >
      {char}
    </motion.span>
  );
}

function AnimatedWord({
  word,
  wordIndex,
  startCharIndex,
  progress,
  transformedColor,
}: {
  word: string;
  wordIndex: number;
  startCharIndex: number;
  progress: MotionValue<number>;
  transformedColor: string;
}) {
  return (
    <span className="inline-block whitespace-nowrap align-baseline">
      {word.split("").map((char, index) => (
        <AnimatedChar
          key={`${wordIndex}-${startCharIndex + index}-${char}`}
          char={char}
          charIndex={startCharIndex + index}
          progress={progress}
          transformedColor={transformedColor}
        />
      ))}
    </span>
  );
}

export function ScrollAnimatedText({
  title,
  subtitle,
  transformedColor = "#000000",
  href,
  hrefText,
  position = "text-start",
  className = "text-7xl max-w-3xl",
  headingClassName = "text-[clamp(2.8rem,6vw,5.5rem)] font-black tracking-tight leading-[1.04] text-neutral-950 max-w-4xl",
  subtitleClassName = "mt-4 text-lg md:text-2xl",
  as = "h2",
}: ScrollAnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 78%", "start 20%"],
  });

  const headlineY = useSmoothTransform(
    useTransform(scrollYProgress, [0, 0.5], [80, -30]),
    50,
    18
  );

  const progress = useTransform(scrollYProgress, [0, 1], [0, charCount]);

  useEffect(() => {
    const safeTitle = typeof title === "string" ? title : "";
    const safeSubtitle = typeof subtitle === "string" ? subtitle : "";
    setCharCount(safeTitle.length + safeSubtitle.length);
  }, [title, subtitle]);

  const renderAnimatedText = (text: string | undefined, startIndex: number) => {
    const safeText = typeof text === "string" ? text : "";
    const words = safeText.split(" ");

    let runningIndex = startIndex;

    return words.map((word, wordIndex) => {
      const currentStartIndex = runningIndex;
      runningIndex += word.length + 1;

      return (
        <span key={`${word}-${wordIndex}`} className="inline-block align-baseline">
          <AnimatedWord
            word={word}
            wordIndex={wordIndex}
            startCharIndex={currentStartIndex}
            progress={progress}
            transformedColor={transformedColor}
          />
          {wordIndex !== words.length - 1 && "\u00A0"}
        </span>
      );
    });
  };

  const HeadingTag = as;

  return (
    <div ref={containerRef} className={`relative py-20 ${position}`}>
      {href && (
        <Button variant="link" className="group text-start">
          <Link href={href} className="inline-flex items-center gap-1">
            {hrefText}
            <ArrowUpRight className="size-5 transition-all duration-400 group-hover:rotate-45" />
          </Link>
        </Button>
      )}

      <div className="">
        <motion.div style={{ y: headlineY }}>
          <HeadingTag className={headingClassName}>
            <span className={`${className} block font-bold`}>
              {renderAnimatedText(title, 0)}
            </span>
          </HeadingTag>
        </motion.div>
      </div>

      {subtitle && (
        <p className={subtitleClassName}>
          {renderAnimatedText(subtitle, title.length)}
        </p>
      )}
    </div>
  );
}