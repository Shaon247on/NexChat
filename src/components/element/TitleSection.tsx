"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

interface TitleSectionProps {
  title: string;
  scrollYProgress: MotionValue<number>;
  className?: string;
  wrapperClassName?: string;
  from?: number;
  to?: number;
  opacityRange?: [number, number];
  topClassName?: string;
}

export default function TitleSection({
  title,
  scrollYProgress,
  className = "text-[2rem] sm:text-[3rem] md:text-[4rem] lg:text-[6rem] xl:text-[12rem] 2xl:text-[13rem]",
  wrapperClassName = "",
  from = 0,
  to = 0.4,
  opacityRange = [0, 0.07],
  topClassName = "top-0",
}: TitleSectionProps) {
  const opacity = useTransform(scrollYProgress, [from, to], opacityRange);

  return (
    <motion.div
      className={`pointer-events-none absolute ${topClassName} left-0 z-0 w-full select-none ${wrapperClassName}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <span
        className={`block whitespace-nowrap leading-none font-black uppercase tracking-tighter text-neutral-900 ${className}`}
      >
        {title}
      </span>
    </motion.div>
  );
}