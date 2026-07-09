/** VIKTOR.SYSTEM — Apple-inspired accent identity
 *  One gradient. One number style. Soft mono chrome elsewhere.
 */

export const progressGradient =
  "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500";

/** CSS class from index.css — pink → purple → blue text */
export const textGradient = "text-system-gradient";

/** Unified digits — SF/Inter tabular, like Process / Module labels */
export const systemNumber = {
  /** MODULE 001, 01 / 08, section index */
  label:
    "font-sans font-semibold tabular-nums tracking-[0.14em] uppercase",
  /** Large expressive % and counters */
  display:
    "font-sans font-bold tabular-nums tracking-tight",
  /** Compact meta (1 / 3 in galleries) */
  meta:
    "font-sans font-medium tabular-nums tracking-wide",
} as const;

/** Soft glass chips with gradient identity */
export const systemTag = {
  base:
    "inline-flex items-center justify-center rounded-full text-xs md:text-[13px] font-medium tracking-wide transition-all duration-300",
  /** Non-clickable meta tags */
  idle: "system-chip",
  /** Clickable — Hero quick links, filters */
  interactive: "system-chip system-chip--interactive cursor-pointer",
  /** Selected / relevant */
  active: "system-chip system-chip--active",
  /** Dimmed / disabled */
  dim: "system-chip system-chip--dim pointer-events-none",
  /** Soft tags without hard frames (Experience filters) */
  ghost: "system-chip system-chip--ghost",
  ghostActive: "system-chip system-chip--ghost-active",
  ghostDim: "system-chip system-chip--ghost-dim pointer-events-none",
} as const;
