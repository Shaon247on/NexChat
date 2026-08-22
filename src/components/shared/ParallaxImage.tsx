"use client";

import Image from "next/image";
import Parallax from "./parallax";

interface Card {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

interface ParallaxImageSectionProps {
  cards: Card[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export function ParallaxImageSection({
  cards,
  sectionTitle,
  sectionSubtitle,
}: ParallaxImageSectionProps) {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-12">
      {sectionTitle && (
        <div className="mb-12 md:mb-16 lg:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="text-base md:text-lg text-gray-600 max-w-2xl">
              {sectionSubtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative flex flex-col h-full rounded-2xl overflow-hidden bg-gray-100"
          >
            <Parallax
              className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden"
              contentClassName="relative w-full h-full"
              effect="translate"
              axis="y"
              range={[-30, 30]}
              smooth
            >
              <Image
                src={card.image}
                alt={card.alt}
                fill
                className="object-cover object-center"
                priority={false}
              />
            </Parallax>

            <div className="flex flex-col p-6 md:p-8 flex-grow">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
                {card.title}
              </h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed flex-grow">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}