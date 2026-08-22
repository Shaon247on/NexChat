import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials, stableIndex } from "@/lib/format";

/**
 * Initials avatar.
 *
 * Colours stay inside the black / white / blue-600 system — a few blue and
 * neutral steps rather than the usual rainbow — so rows are still scannable at a
 * glance without introducing hues the design doesn't use. The shade is derived
 * from the id so it never changes as the list reorders.
 */
const SURFACES = [
  "bg-blue-600",
  "bg-blue-700",
  "bg-neutral-800",
  "bg-blue-500",
  "bg-neutral-900",
] as const;

const SIZES = {
  sm: "size-9 text-[11px]",
  md: "size-11 text-xs",
  lg: "size-12 text-sm",
} as const;

export default function Avatar({
  name,
  seed,
  isGroup = false,
  size = "md",
  className,
}: {
  name: string;
  /** Stable id, so the colour survives reordering. Falls back to the name. */
  seed?: string;
  isGroup?: boolean;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const surface = SURFACES[stableIndex(seed ?? name, SURFACES.length)];

  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none",
        SIZES[size],
        surface,
        className,
      )}
    >
      {isGroup ? <Users className="size-1/2" /> : getInitials(name)}
    </span>
  );
}
