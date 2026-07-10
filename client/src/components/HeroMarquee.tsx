import { systemTag, systemColorTag } from "@/lib/systemUi";

export type HeroLink = {
  label: string;
  stage: number;
};

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
            className={`${systemColorTag(i)} shrink-0 text-sm font-semibold tracking-wide md:text-[15px] transition-transform hover:scale-105 active:scale-95`}
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
