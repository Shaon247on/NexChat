"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type CarouselItem = {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
};

const pinterestSlides: CarouselItem[] = [
  {
    id: 1,
    title: "Brand Systems",
    subtitle: "Design systems that scale with clarity and consistency.",
    image:
      "https://i.pinimg.com/736x/6d/54/75/6d54759dc968dcb9c961481b6253fd7e.jpg",
  },
  {
    id: 2,
    title: "Digital Strategy",
    subtitle: "Purpose-led experiences built for modern brands.",
    image:
      "https://i.pinimg.com/736x/0d/6d/82/0d6d8226f4c09fbe8ac22f3f6c7dc8f6.jpg",
  },
  {
    id: 3,
    title: "Motion Direction",
    subtitle: "Smooth interfaces with premium motion language.",
    image:
      "https://i.pinimg.com/736x/79/5c/8c/795c8c1ccfc2d1535f6c44ac7dfe1f72.jpg",
  },
  {
    id: 4,
    title: "Creative Development",
    subtitle: "Interactive builds focused on performance and impact.",
    image:
      "https://i.pinimg.com/736x/3f/d5/59/3fd559eb8e2f71a0b74be0a7d1c2c2d5.jpg",
  },
  {
    id: 5,
    title: "Growth Experience",
    subtitle: "Conversion-focused digital execution for modern teams.",
    image:
      "https://i.pinimg.com/736x/34/5d/d9/345dd9a8a2b8efc93f8c9fd54a0b3f89.jpg",
  },
  {
    id: 6,
    title: "Product Identity",
    subtitle: "Strong product storytelling with premium visual systems.",
    image:
      "https://i.pinimg.com/736x/6e/d2/5d/6ed25dc6c1465c72c5996fdf74f8c6f4.jpg",
  },
];

interface ServicesCarouselProps {
  items?: CarouselItem[];
  className?: string;
}

export default function ServicesCarousel({
  items = pinterestSlides,
  className,
}: ServicesCarouselProps) {
  const slides = useMemo(() => items, [items]);
  const [page, setPage] = useState(0);

  const total = slides.length;
  const visibleDesktop = 3;
  const pageCount = Math.ceil(total / visibleDesktop);

  const nextPage = () => {
    setPage((prev) => (prev + 1) % pageCount);
  };

  const prevPage = () => {
    setPage((prev) => (prev - 1 + pageCount) % pageCount);
  };

  const goToPage = (index: number) => {
    setPage(index);
  };

  return (
    <section className={cn("relative w-full", className)}>
      <div className="overflow-hidden">
        <motion.div
          animate={{ x: `-${page * 100}%` }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
          style={{ width: `${pageCount * 100}%` }}
        >
          {Array.from({ length: pageCount }).map((_, pageIndex) => {
            const start = pageIndex * visibleDesktop;
            const chunk = slides.slice(start, start + visibleDesktop);

            return (
              <div
                key={pageIndex}
                className="grid w-full shrink-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
                style={{ width: `${100 / pageCount}%` }}
              >
                {chunk.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5"
                  >
                    <div className="relative aspect-[4/5] w-full">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/65">
                          Featured Work
                        </p>
                        <h3 className="text-lg font-semibold text-white md:text-xl">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="mt-2 text-sm leading-relaxed text-white/78">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}

                {chunk.length < visibleDesktop &&
                  Array.from({ length: visibleDesktop - chunk.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="hidden xl:block"
                    />
                  ))}
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Array.from({ length: pageCount }).map((_, index) => {
            const active = index === page;
            return (
              <button
                key={index}
                type="button"
                onClick={() => goToPage(index)}
                aria-label={`Go to page ${index + 1}`}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  active ? "w-8 bg-white" : "w-2.5 bg-white/35"
                )}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevPage}
            aria-label="Previous"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={nextPage}
            aria-label="Next"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}