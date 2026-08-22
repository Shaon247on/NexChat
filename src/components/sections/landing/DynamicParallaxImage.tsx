"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Parallax from "@/components/shared/parallax";

interface DynamicParallaxImageProps {
  src: string;
  alt: string;

  containerClassName?: string;
  contentClassName?: string;
  imageClassName?: string;
  overlayClassName?: string;

  priority?: boolean;
  fill?: boolean;

  imgWidth?: number;
  imgHeight?: number;

  effect?: "translate" | "scale" | "rotate" | "opacity";
  axis?: "x" | "y";
  range?: [number, number];
  reverse?: boolean;
  smooth?: boolean;
  disabled?: boolean;

  children?: ReactNode;
}

export default function DynamicParallaxImage({
  src,
  alt,
  containerClassName,
  contentClassName,
  imageClassName,
  overlayClassName,
  priority = false,
  fill = true,
  imgWidth = 1600,
  imgHeight = 1200,
  effect = "translate",
  axis = "y",
  range = [-30, 30],
  reverse = false,
  smooth = true,
  disabled = false,
  children,
}: DynamicParallaxImageProps) {
  return (
    <Parallax
      className={cn("relative overflow-hidden", containerClassName)}
      contentClassName={cn("relative w-full h-full", contentClassName)}
      effect={effect}
      axis={axis}
      range={range}
      reverse={reverse}
      smooth={smooth}
      disabled={disabled}
    >
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={cn("object-cover object-center", imageClassName)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={imgWidth}
          height={imgHeight}
          priority={priority}
          className={cn("w-full h-full object-cover object-center", imageClassName)}
        />
      )}

      {overlayClassName ? (
        <div className={cn("absolute inset-0 pointer-events-none", overlayClassName)} />
      ) : null}

      {children}
    </Parallax>
  );
}