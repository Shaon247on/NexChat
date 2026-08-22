"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import TitleSection from "@/components/element/TitleSection";
import { ScrollAnimatedText } from "@/components/shared/ScrollAnimatedText";
import Link from "next/link";
interface Service {
  id: string;
  number: string;
  title: string;
  description?: string;
  image: string;
  href: string;
}

const services: Service[] = [
  {
    id: "01",
    number: "[01]",
    title: "Real-time delivery",
    description:
      "Messages appear the moment they're sent — yours the instant you press enter, theirs without you touching anything. No refresh button, no pull-to-reload.",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    href: "#features",
  },
  {
    id: "02",
    number: "[02]",
    title: "Groups with real controls",
    description:
      "Add three or more people, name the group, and manage it properly: promote admins, add or remove members, rename it, or leave. Only admins can make changes.",
    image: "https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg",
    href: "#features",
  },
  {
    id: "03",
    number: "[03]",
    title: "Find anyone by name",
    description:
      "Search the directory as you type. Pick someone you already talk to and the thread opens instantly; pick someone new and the conversation starts itself.",
    image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
    href: "#features",
  },
  {
    id: "04",
    number: "[04]",
    title: "You always know if it sent",
    description:
      "A message shows as sending, then confirms when it lands. If it fails it says so, keeps your text, and offers to retry — nothing is ever quietly marked delivered.",
    image: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg",
    href: "#features",
  },
  {
    id: "05",
    number: "[05]",
    title: "Scrolling that respects you",
    description:
      "It follows the newest message while you're at the bottom, and stops the moment you scroll up to read. New arrivals wait behind a badge instead of yanking you away.",
    image: "https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg",
    href: "#features",
  },
];
export default function SolutionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState<string>("01");
  const [direction, setDirection] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const handleServiceChange = (newServiceId: string) => {
    const currentIndex = services.findIndex((s) => s.id === activeService);
    const newIndex = services.findIndex((s) => s.id === newServiceId);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveService(newServiceId);
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-6 md:py-8 lg:py-20"
    >
      {/* Header */}

      <TitleSection
        scrollYProgress={scrollYProgress}
        title="FEATURES"
        className="text-5xl md:text-8xl lg:text-[130px] xl:text-[200px]"
        topClassName="top-10"
      />

      {/* Main Content */}
      <div className="py-24 md:py-32 lg:py-40 max-w-7xl mx-auto">
        <ScrollAnimatedText
          title="Everything you need to hold a conversation, and nothing you don't."
          className=""
        />
        <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-16 pb-20  ">
          {/* Left Side - Sticky Image & Counter */}
          <div className="lg:sticky top-32 lg:w-[42%] h-[50vh] lg:h-[calc(100vh-12rem)] flex flex-col">
            {/* Image Container */}
            <div className="relative flex-1 rounded-3xl overflow-hidden bg-neutral-200 max-h-100">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={activeService}
                  initial={{
                    opacity: 0,
                    scale: 1.1,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={
                      services.find((s) => s.id === activeService)?.image || ""
                    }
                    alt={
                      services.find((s) => s.id === activeService)?.title || ""
                    }
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Gradient Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-linear-to-br from-black/20 via-transparent to-transparent"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Decorative Corner Element */}
              <motion.div
                className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-white/30 rounded-tl-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </div>

            {/* Counter */}
            <motion.div
              className="mt-8 space-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="text-5xl lg:text-6xl font-bold tracking-tight">
                <motion.span
                  key={`counter-${activeService}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="tabular-nums inline-block"
                >
                  {activeService}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="ml-2 inline-block text-neutral-300"
                >
                  / 0{services.length}
                </motion.span>
              </div>
              <div className="text-sm text-neutral-600">
                {services.find((service) => service.id === activeService)?.title}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Scrollable Services List */}
          <div className="lg:w-[60%] ">
            {services.map((service, index) => (
              <ServiceItem
                key={service.id}
                service={service}
                index={index}
                isActive={activeService === service.id}
                onHover={() => handleServiceChange(service.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ServiceItemProps {
  service: Service;
  index: number;
  isActive: boolean;
  onHover: () => void;
}

function ServiceItem({ service, index, isActive, onHover }: ServiceItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, 20]);

  return (
    // No longer a link: the per-service detail pages don't exist in the single-page
    // site. The row still drives the sticky preview image on hover, which is what it
    // was actually for.
    <div>
      <motion.div
        ref={ref}
        onMouseEnter={onHover}
        className="relative py-8 lg:py-12 border-b border-neutral-300 last:border-b-0 cursor-pointer group"
        style={{ opacity }}
        initial={{ opacity: 1, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px", amount: 0.3 }}
        transition={{
          duration: 0.7,
          delay: index * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <motion.div className="flex items-start gap-4" style={{ y }}>
          {/* Number */}
          <motion.div
            className="text-base lg:text-xl font-light min-w-16 lg:min-w-20 pt-2"
            animate={{
              color: isActive ? "#2563eb" : "#a3a3a3",
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {service.number}
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <motion.h2
              className="text-4xl md:text-4xl font-bold tracking-tight leading-tight"
              animate={{
                color: isActive ? "#171717" : "#d4d4d4",
                x: isActive ? 8 : 0,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {service.title}
            </motion.h2>

            {/* Description - Shows on active */}
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{
                opacity: isActive ? 1 : 0,
                height: isActive ? "auto" : 0,
                marginTop: isActive ? 24 : 0,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="text-base xl:text-lg text-neutral-700 max-w-2xl leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          </div>

          {/* Arrow Icon */}
          <motion.div
            className="mt-2 lg:mt-4"
            animate={{
              x: isActive ? 8 : 0,
              opacity: isActive ? 1 : 0,
              rotate: isActive ? 45 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <ArrowUpRight className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
          </motion.div>
        </motion.div>

        {/* Active Indicator Line */}
        <motion.div
          className="absolute left-0 bottom-0 h-[2px] bg-blue-600"
          initial={{ width: 0 }}
          animate={{
            width: isActive ? "100%" : "0%",
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </div>
  );
}
