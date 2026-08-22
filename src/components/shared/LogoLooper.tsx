"use client";

import React from "react";
import {
  SiNextdotjs,
  SiReact,
  SiDjango,
  SiNodedotjs,
  SiExpress,
  SiRedis,
  SiSocketdotio,
  SiTypescript,
  SiPrisma,
  SiPostgresql,
} from "react-icons/si";
import ScrollVelocity from "@/components/element/ScrollVelocity";

const techItems = [
  { name: "Next.js", icon: SiNextdotjs },
  { name: "React.js", icon: SiReact },
  { name: "Django", icon: SiDjango },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Express", icon: SiExpress },
  { name: "Redis", icon: SiRedis },
  { name: "Socket.IO", icon: SiSocketdotio },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Prisma", icon: SiPrisma },
  { name: "PostgreSQL", icon: SiPostgresql },
];

function TechPill({
  name,
  Icon,
}: {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mx-4 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-6 py-4 shadow-sm">
      <Icon className="h-6 w-6 text-black" />
      <span className="text-lg font-semibold text-black md:text-xl">{name}</span>
    </div>
  );
}

export default function LogoLooper() {
  const row = techItems.map(({ name, icon: Icon }) => (
    <TechPill key={name} name={name} Icon={Icon} />
  ));

  return (
    <section className="w-full border-y border-black/10 bg-[#f8f8f8]/30 py-4">
      <div className="overflow-hidden">
        <ScrollVelocity
          texts={[row]}
          velocity={35}
          numCopies={8}
          className="inline-flex! items-center!"
          parallaxClassName="py-2"
          scrollerClassName="flex items-center"
        />
      </div>
    </section>
  );
}