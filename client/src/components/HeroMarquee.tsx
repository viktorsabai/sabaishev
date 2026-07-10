import { systemTag } from "@/lib/systemUi";

export type HeroLink = {
  label: string;
  stage: number;
};

const CHIP_TONES = [
  "border-pink-400/45 bg-gradient-to-r from-pink-500/30 via-purple-500/22 to-blue-500/15 text-foreground shadow-[0_0_24px_-8px_rgba(236,72,153,0.5)]",
  "border-purple-400/45 bg-gradient-to-r from-purple-500/28 via-blue-500/18 to-pink-500/12 text-foreground shadow-[0_0_24px_-8px_rgba(168,85,247,0.45)]",
  "border-blue-400/40 bg-gradient-to-r from-blue-500/25 via-purple-500/18 to-pink-500/12 text-foreground shadow-[0_0_24px_-8px_rgba(59,130,246,0.4)]",
  "border-fuchsia-400/40 bg-gradient-to-r from-fuchsia-500/25 via-pink-500/20 to-purple-500/15 text-foreground shadow-[0_0_24px_-8px_rgba(217,70,239,0.4)]",
];

function MarqueeRow({
  items,
  direction,
  onTap,
}: {
  items: HeroLink[];
  direction: "left" | "right";
  onTap: (stage: number) => void;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="hero-marquee-row relative flex overflow-hidden">
      <div
        className={`hero-marquee-track flex shrink-0 gap-3 md:gap-4 ${
          direction === "left" ? "hero-marquee-left" : "hero-marquee-right"
        }`}
      >
        {doubled.map((link, i) => (
          <button
            key={`${link.label}-${i}`}
            type="button"
            onClick={() => onTap(link.stage)}
            className={`${systemTag.base} shrink-0 px-5 py-2.5 text-sm font-semibold tracking-wide md:px-6 md:py-3 md:text-[15px] ${CHIP_TONES[i % CHIP_TONES.length]} transition-transform hover:scale-105 active:scale-95`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HeroMarquee({
  links,
  onLinkTap,
}: {
  links: HeroLink[];
  onLinkTap: (stage: number) => void;
}) {
  const mid = Math.ceil(links.length / 2);
  const rowA = links.slice(0, mid);
  const rowB = links.slice(mid);

  return (
    <div className="hero-marquee-mask relative mx-auto mb-12 w-full max-w-4xl md:mb-16">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0F0F12] to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0F0F12] to-transparent md:w-24" />

      <div className="space-y-3 md:space-y-4">
        <MarqueeRow items={rowA} direction="left" onTap={onLinkTap} />
        <MarqueeRow items={rowB.length ? rowB : rowA} direction="right" onTap={onLinkTap} />
      </div>
    </div>
  );
}
