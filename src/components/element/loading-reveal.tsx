"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const NUM_BARS = 9;

export default function LoadingReveal() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 18;
      });
    }, 120);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-99 pointer-events-none overflow-hidden"
          exit={{ opacity: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: -16,
              transition: {
                duration: 0.28,
                ease: [0.76, 0, 0.24, 1],
              },
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center"
          >
            <div className="flex h-20 items-center justify-center">
              <motion.div
                className="relative h-14 w-14 shrink-0 origin-center"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.8,
                  ease: "easeInOut",
                }}
                style={{ willChange: "transform" }}
              >
                <Image
                  src="/fav-icon.png"
                  alt="Nexus Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>

            <div className="flex min-h-[64px] flex-col items-center justify-start">
              <motion.span
                className="font-display text-3xl font-bold leading-none tracking-[0.15em] text-white uppercase"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              >
                Nexus
              </motion.span>

              <motion.span
                className="font-body mt-2 text-xs leading-none tracking-[0.3em] text-blue-200/60 uppercase"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5, ease: "easeOut" }}
              >
                Design & Strategy
              </motion.span>
            </div>

            <motion.div
              className="relative mt-6 h-px w-48 overflow-hidden bg-white/10"
              initial={{ opacity: 0, scaleX: 0.5 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-blue-400"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: "easeOut", duration: 0.18 }}
              />
            </motion.div>

            <motion.span
              className="font-body mt-3 text-xs tracking-widest text-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              {Math.min(Math.round(progress), 100)}%
            </motion.span>
          </motion.div>

          <div className="absolute inset-0 flex">
            {Array.from({ length: NUM_BARS }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1"
                style={{
                  background:
                    i % 2 === 0 ? "rgb(10, 20, 60)" : "rgb(15, 30, 80)",
                }}
                initial={{ y: "0%" }}
                exit={{
                  y: "-100%",
                  transition: {
                    duration: 0.75,
                    delay: i * 0.055,
                    ease: [0.76, 0, 0.24, 1],
                  },
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
