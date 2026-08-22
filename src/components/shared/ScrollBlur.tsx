"use client";

import { useState } from "react";
import GradualBlur from "@/components/element/GradualBlur";
import { useLenis } from "lenis/react";

export default function ScrollBlur() {
  const [opacity, setOpacity] = useState(0);

  useLenis(({ scroll }) => {
    // Fade in over the first 80px of scroll
    const progress = Math.min(scroll / 80, 1);
    setOpacity(progress);
  });

  return (
    <div
      style={{
        opacity,
        transition: "opacity 0.3s ease-out",
      }}
    >
      <GradualBlur
        target="page"
        position="bottom"
        height="3rem"
        strength={3}
        divCount={8}
        curve="bezier"
        exponential
        opacity={1}
        zIndex={9999}
      />
    </div>
  );
}
