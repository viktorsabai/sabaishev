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
  /** Larger chips — Experience competency row */
  lg:
    "inline-flex items-center justify-center rounded-full text-sm md:text-[15px] font-semibold tracking-wide transition-all duration-300 px-4 py-2 md:px-5 md:py-2.5",
  /** Padding + border shell for gradient tone chips */
  chip: "px-3.5 py-1.5 md:px-4 md:py-2 border",
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

/** Rotating gradient chip tones — Hero, Stack, Products, Experience */
export const systemTagTones = [
  "border-pink-400/45 bg-gradient-to-r from-pink-500/30 via-purple-500/22 to-blue-500/15 text-foreground shadow-[0_0_20px_-8px_rgba(236,72,153,0.45)]",
  "border-purple-400/45 bg-gradient-to-r from-purple-500/28 via-blue-500/18 to-pink-500/12 text-foreground shadow-[0_0_20px_-8px_rgba(168,85,247,0.4)]",
  "border-blue-400/40 bg-gradient-to-r from-blue-500/25 via-purple-500/18 to-pink-500/12 text-foreground shadow-[0_0_20px_-8px_rgba(59,130,246,0.38)]",
  "border-fuchsia-400/40 bg-gradient-to-r from-fuchsia-500/25 via-pink-500/20 to-purple-500/15 text-foreground shadow-[0_0_20px_-8px_rgba(217,70,239,0.38)]",
] as const;

export function systemTagTone(index: number): string {
  return systemTagTones[index % systemTagTones.length];
}

export function systemColorTag(index: number): string {
  return `${systemTag.base} ${systemTag.chip} ${systemTagTone(index)}`;
}
