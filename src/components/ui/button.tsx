import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // ─── Base ───────────────────────────────────────────────────────────────────
  // `relative overflow-hidden` are required for the shimmer/fill pseudo-elements.
  // `before:` pseudo-element is the animated layer for most variants.
  [
    "group/button relative overflow-hidden",
    "inline-flex shrink-0 items-center justify-center",
    " border border-transparent bg-clip-padding",
    "text-sm font-medium whitespace-nowrap",
    "transition-all duration-200 outline-none select-none",
    // focus / disabled / aria states
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "active:not-aria-[haspopup]:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-blue-500 aria-invalid:ring-3 aria-invalid:ring-blue-500/20",
    "dark:aria-invalid:border-blue/50 dark:aria-invalid:ring-blue-500/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        // ── Default: blue bg + white text
        // Hover → diagonal shimmer sweep across the face
        default: [
          "bg-blue-600 text-white border-blue-600",
          "shadow-[0_1px_3px_rgba(37,99,235,0.4)]",
          "hover:bg-blue-600 hover:shadow-[0_4px_16px_rgba(37,99,235,0.55)]",
          // shimmer pseudo-element
          "before:absolute before:inset-0",
          "before:bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.22)_50%,transparent_65%)]",
          "before:translate-x-[-120%] before:skew-x-[-12deg]",
          "before:transition-transform before:duration-500 before:ease-out",
          "hover:before:translate-x-[120%]",
        ],

        // ── Outline: border slides inward as a fill on hover
        outline: [
          "border-border bg-background text-foreground",
          "dark:border-input dark:bg-input/30",
          // fill layer grows from left
        "before:absolute before:inset-0",
          "before:bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.22)_50%,transparent_65%)]",
          "before:translate-x-[-120%] before:skew-x-[-12deg]",
          "before:transition-transform before:duration-500 before:ease-out",
          "hover:before:translate-x-[120%]",
        ],

        // ── Secondary: subtle scale + shadow pop
        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
          "hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)]",
          "hover:-translate-y-px",
          "aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ],

        // ── Ghost: background floods in from bottom on hover
        ghost: [
          "text-foreground",
          "before:absolute before:inset-0 before:origin-bottom before:scale-y-0",
          "before:bg-muted",
          "before:transition-transform before:duration-220 before:ease-out",
          "hover:before:scale-y-100",
          "[&>*]:relative [&>*]:z-10",
          "dark:hover:bg-transparent",
          "aria-expanded:bg-muted aria-expanded:text-foreground",
        ],

        // ── Destructive: glow pulse + slight scale
        destructive: [
          "bg-blue-500/10 text-blue-500",
          "focus-visible:border-blue-500/40 focus-visible:ring-blue-500/20",
          "dark:bg-blue-500/20 dark:focus-visible:ring-blue-500/40",
          "hover:bg-blue-500/20 dark:hover:bg-blue-500/30",
          "hover:shadow-[0_0_0_3px_rgba(239,68,68,0.18)]",
          "hover:scale-[1.025]",
          "active:scale-100",
        ],

        // ── Link: underline draws in from left
        link: [
          "text-primary underline-offset-4",
          // underline via gradient background trick
          "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-no-repeat bg-left-bottom",
          "hover:bg-[length:100%_1.5px]",
          "transition-[background-size] duration-300 ease-out",
        ],
      },

      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  // outline + ghost use before: fill layers, so children must be wrapped
  // in a relative z-10 span so they render above the fill.
  const needsWrapper = variant === "outline" || variant === "ghost"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {needsWrapper ? (
        <span className="relative z-10 inline-flex items-center gap-inherit">
          {children}
        </span>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }