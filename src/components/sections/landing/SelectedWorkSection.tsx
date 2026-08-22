"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Parallax from "../../shared/parallax";
import { ScrollAnimatedText } from "@/components/shared/ScrollAnimatedText";
import TitleSection from "@/components/element/TitleSection";
import { projectSummaries } from "@/data/projects";

type ProjectCardData = {
  id: string;
  title: string;
  meta: string;
  image: string;
  tags: string[];
  href: string;
};

const projects: ProjectCardData[] = projectSummaries.map((project) => ({
  id: project.id,
  title: project.title,
  meta: `${project.category} • ${project.year}`,
  image: project.coverImage,
  tags: project.tags,
  href: project.href,
}));

export default function SelectedWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const leftOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);
  const leftY = useTransform(scrollYProgress, [0.85, 1], [0, -24]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white pt-4 md:pt-6 lg:pt-10 xl:pt-32"
      style={{ minHeight: `${projects.length * 10 + 40}vh` }}
    >
      <TitleSection
        scrollYProgress={scrollYProgress}
        title="our projects"
        className="text-5xl md:text-[7rem] lg:text-[9rem] xl:text-[12rem]"
        topClassName="top-0"
      />

      <div className="mx-auto flex h-full w-full max-w-7xl flex-col lg:flex-row">
        <div className="z-10 flex items-start py-16 lg:sticky lg:top-0 lg:h-screen lg:w-[40%] lg:py-20">
          <motion.div
            style={{
              opacity: leftOpacity,
              y: leftY,
            }}
            className="max-w-lg"
          >
            <ScrollAnimatedText title="Selected work we're proud of" />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.18,
              }}
              className="-mt-10 mb-10 max-w-xs text-sm leading-relaxed text-neutral-500 md:text-base"
            >
              A curated selection of projects where strategy, creativity, and
              craftsmanship come together to build meaningful and enduring brand
              experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.25,
              }}
            >
              <Link href="/login">
                <button className="group inline-flex items-center gap-3 rounded-full bg-neutral-950 py-2 pr-2 pl-6 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-600">
                  View Latest Projects
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-white/20">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-12 flex items-center gap-6 border-t border-neutral-100 pt-8"
            >
              <div>
                <div className="text-2xl font-bold text-neutral-950">
                  {projects.length}+
                </div>
                <div className="mt-0.5 text-xs tracking-wide text-neutral-400">
                  Projects showcased
                </div>
              </div>
              <div className="h-8 w-px bg-neutral-200" />
              <div>
                <div className="text-2xl font-bold text-neutral-950">2026</div>
                <div className="mt-0.5 text-xs tracking-wide text-neutral-400">
                  Latest collection
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="space-y-8 px-4 py-10 md:px-8 lg:w-[60%] lg:space-y-10 lg:px-10 lg:py-16">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
          <div className="h-8 lg:h-16" />
        </div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: ProjectCardData;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const imageHeight = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    ["270px", "440px", "580px", "440px", "270px"]
  );

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.04, 1]);

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.28, 0, 0.28]
  );

  const hasImage =
    typeof project.image === "string" && project.image.trim().length > 0;

  return (
    // Not a link: the per-project detail pages don't exist in the single-page site.
    // The card keeps its scroll-driven height and parallax, which is the point of it.
    <div className="block">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px", amount: 0.15 }}
        transition={{
          duration: 0.7,
          delay: index * 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="group relative overflow-hidden rounded-2xl border cursor-pointer"
      >
        <motion.div
          className="relative w-full overflow-hidden bg-neutral-100"
          style={{ height: imageHeight }}
        >
          {hasImage ? (
            <Parallax
              className="absolute inset-0 h-full w-full"
              contentClassName="h-full w-full"
              effect="translate"
              axis="y"
              range={[-20, 20]}
              smooth
            >
              <motion.div
                className="relative h-full w-full"
                style={{ scale: imageScale }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  priority={index === 0}
                />
              </motion.div>
            </Parallax>
          ) : (
            <div className="flex h-full w-full items-center justify-center px-6 text-center">
              <div>
                <p className="text-lg font-semibold text-neutral-900">
                  {project.title}
                </p>
                <p className="mt-2 text-sm text-neutral-500">
                  Preview image coming soon
                </p>
              </div>
            </div>
          )}

          {hasImage && (
            <motion.div
              className="pointer-events-none absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          )}
        </motion.div>

        <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-start sm:justify-between md:px-6 md:py-5">
          <div>
            <h3 className="text-lg leading-tight font-bold text-neutral-950 md:text-xl">
              {project.title}
            </h3>
            <p className="mt-0.5 text-xs leading-snug text-neutral-500 md:text-sm">
              {project.meta}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:max-w-[55%] sm:justify-end">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="whitespace-nowrap rounded-full border border-neutral-300 bg-white/70 px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-neutral-600 md:text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md"
          initial={{ opacity: 0, scale: 0.7 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <ArrowRight className="h-4 w-4 text-neutral-950" />
        </motion.div>
      </motion.div>
    </div>
  );
}