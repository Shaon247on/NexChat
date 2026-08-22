"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import { ScrollAnimatedText } from "@/components/shared/ScrollAnimatedText";
import TitleSection from "@/components/element/TitleSection";
import { Button } from "@/components/ui/button";
import { ArrowBigRight, ArrowRight } from "lucide-react";

const IMAGE_URL =
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80";

const faqs = [
  {
    id: 1,
    question: "Do I need to create an account?",
    answer:
      "No. Enter your phone number and a name — if the number hasn't been used before, the account is created for you. There's no password to set and nothing to verify.",
  },
  {
    id: 2,
    question: "How do I find someone to talk to?",
    answer:
      "Search by name. Pick a result and the conversation opens — if you've already talked, you land back in the existing thread with its history rather than starting a duplicate.",
  },
  {
    id: 3,
    question: "How do group chats work?",
    answer:
      "Pick two or more people and give the group a name — three members is the minimum. Whoever creates it starts as an admin, and admins can rename it, add or remove members, and promote others. Any member can leave at any time.",
  },
  {
    id: 4,
    question: "Do messages arrive without refreshing?",
    answer:
      "Yes. New messages appear on their own, and the thread follows the latest one while you're at the bottom. If you've scrolled up to read, it leaves you alone and shows a badge instead.",
  },
  {
    id: 5,
    question: "What happens if a message doesn't send?",
    answer:
      "It's marked as not delivered, your text stays exactly where it was, and you get Retry and Discard. A message is only ever shown as sent once the server has actually confirmed it.",
  },
  {
    id: 6,
    question: "Why is the first load sometimes slow?",
    answer:
      "The demo API is hosted on a free tier that sleeps when idle, so the first request after a quiet spell can take up to 30 seconds to wake it. The app tells you that's what's happening rather than leaving you with a spinner.",
  },
];

function useParallax(
  ref: React.RefObject<HTMLDivElement>,
  range: [string, string],
) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  return useTransform(smooth, [0, 1], range);
}

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useParallax(imageRef as React.RefObject<HTMLDivElement>, [
    "-8%",
    "8%",
  ]);
  const rightY = useParallax(rightRef as React.RefObject<HTMLDivElement>, [
    "20px",
    "-20px",
  ]);

  return (
    <section
      ref={sectionRef}
      className="w-full px-6 md:px-12 lg:px-20 py-24 bg-white"
    >
      <div className="max-w-420 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* ── Left column ── */}
          <motion.div
            ref={imageRef}
            className="flex flex-col gap-8"
            style={{ y: imageY }}
          >
            {/* Image with parallax inner crop */}
            <div
              className="relative w-full overflow-hidden"
              style={{
                borderRadius: "12px",
                aspectRatio: "3 / 3.8",
              }}
            >
              <motion.img
                src={IMAGE_URL}
                alt="Support"
                className="w-full h-full object-cover"
                style={{
                  scale: 1.12,
                  y: useTransform(
                    useSpring(
                      useScroll({
                        target: imageRef as React.RefObject<HTMLDivElement>,
                        offset: ["start end", "end start"],
                      }).scrollYProgress,
                      { stiffness: 60, damping: 20 },
                    ),
                    [0, 1],
                    ["-6%", "6%"],
                  ),
                }}
                draggable={false}
              />
            </div>

            {/* CTA below image */}
            <div className="flex flex-col gap-2">
              <p
                className="font-semibold text-slate-900"
                style={{
                  fontFamily: "var(--font-syne)",
                  fontSize: "1.05rem",
                }}
              >
                Easier to just try it
              </p>
              <p
                className="text-sm text-slate-400"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Your number and a name is all it takes
              </p>

              <div className="flex items-center gap-2 mt-3">
                <Button variant={"default"} className=" px-8 py-6" >
                  <Link href="/login" className="flex items-center gap-1 justify-between">
                    Start messaging
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* ── Right column ── */}
          <motion.div
            ref={rightRef}
            className="flex flex-col gap-8"
            style={{ y: rightY }}
          >
            {/* Label */}

            {/* Heading */}
            <ScrollAnimatedText
              title="Answered questions. Everything you might want to know—up front."
              className="text-5xl mt-40"
            />
            <TitleSection
              title="FAQ"
              className="text-[14rem]"
              scrollYProgress={scrollYProgress}
            />

            {/* Accordion */}
            <div className="flex flex-col gap-3 w-full -mt-20 relative z-100">
              {faqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="w-full overflow-hidden cursor-pointer"
                    style={{
                      background: "#f4f4f4",
                      borderRadius: "10px",
                      border: isOpen
                        ? "1px solid rgba(0,0,0,0.06)"
                        : "1px solid transparent",
                      transition: "border-color 0.2s ease",
                    }}
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                  >
                    {/* Question row */}
                    <div className="flex items-center justify-between px-5 py-4 gap-4">
                      <div className="flex items-center gap-3">
                        {/* Number badge */}
                        <span
                          className="flex items-center justify-center w-6 h-6 text-white text-xs font-semibold flex-shrink-0"
                          style={{
                            background: "#0f0f0f",
                            borderRadius: "999px",
                            fontFamily: "var(--font-dm-sans)",
                          }}
                        >
                          {faq.id}
                        </span>
                        <span
                          className="text-slate-900 text-sm font-medium leading-snug"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          {faq.question}
                        </span>
                      </div>

                      {/* +/− icon */}
                      <motion.span
                        animate={{ rotate: isOpen ? 0 : 0 }}
                        className="text-slate-400 text-lg flex-shrink-0 select-none leading-none"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {isOpen ? "−" : "+"}
                      </motion.span>
                    </div>

                    {/* Answer */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{ overflow: "hidden" }}
                        >
                          <p
                            className="px-5 pb-5 text-sm leading-relaxed"
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              color: "rgba(0,0,0,0.45)",
                              paddingLeft: "calc(1.25rem + 24px + 12px)",
                            }}
                          >
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
