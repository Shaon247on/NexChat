"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useRef,
} from "react";

type ParallaxRange = [number, number];
type Axis = "x" | "y";
type EffectType = "translate" | "scale" | "rotate" | "opacity";

// Reuse Framer Motion's own offset typing instead of hardcoding string tuples
type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

interface BaseParallaxProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  axis?: Axis;
  range?: ParallaxRange;
  offset?: ScrollOffset;
  effect?: EffectType;
  reverse?: boolean;
  smooth?: boolean;
  springStiffness?: number;
  springDamping?: number;
  springMass?: number;
  disabled?: boolean;
  style?: CSSProperties;
}

type ParallaxProps<T extends ElementType = "div"> = BaseParallaxProps & {
  as?: T;
};

export default function Parallax<T extends ElementType = "div">({
  as,
  children,
  className,
  contentClassName,
  axis = "y",
  range = [-60, 60],
  offset = ["start end", "end start"],
  effect = "translate",
  reverse = false,
  smooth = true,
  springStiffness = 90,
  springDamping = 22,
  springMass = 0.35,
  disabled = false,
  style,
}: ParallaxProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const outputRange: ParallaxRange = reverse ? [range[1], range[0]] : range;

  // Hooks must be called at the top level, not inside a normal helper function
  const transformedValue = useTransform(scrollYProgress, [0, 1], outputRange);

  // Always call useSpring. Then decide later whether to use it.
  const springValue = useSpring(transformedValue, {
    stiffness: springStiffness,
    damping: springDamping,
    mass: springMass,
  });

  const resolvedValue: MotionValue<number> =
    smooth && effect !== "opacity" ? springValue : transformedValue;

  const isDisabled = disabled || shouldReduceMotion;

  const motionStyle: Record<string, MotionValue<number> | undefined> = {};

  if (!isDisabled) {
    if (effect === "translate") {
      motionStyle[axis] = resolvedValue;
    } else if (effect === "scale") {
      motionStyle.scale = resolvedValue;
    } else if (effect === "rotate") {
      motionStyle.rotate = resolvedValue;
    } else if (effect === "opacity") {
      motionStyle.opacity = resolvedValue;
    }
  }

  return (
    <Component ref={ref} className={className} style={style}>
      <motion.div className={contentClassName} style={motionStyle}>
        {children}
      </motion.div>
    </Component>
  );
}