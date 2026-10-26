import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/content";
import { sceneContent, TELEGRAM_URL } from "./sceneContent";
import { DEFS, GRID, LEADS, SCENES, SHIP, STARS } from "./shipMarkup";
import "./scene.css";

// The scene is authored on a fixed 1440×900 canvas (same as the Claude Design mockups)
// and scaled to fit the viewport, so every state keeps one composition.
const W = 1440;
const H = 900;
const EASE = "cubic-bezier(.65,0,.2,1)";

// Deck anchor dots on the ship (hero coordinates) and label placement around it.
const DOTS: [number, number][] = [
  [816.1, 539.7], [841, 476.1], [872.9, 408.4], [904.9, 340.8],
  [929.8, 281.3], [965.3, 414.6], [912, 691.4], [652.7, 707.9],
];
const LABELS: [number, number, "end" | "start" | "middle"][] = [
  [695.5, 478.2, "end"], [720.4, 414.6, "end"], [752.4, 346.9, "end"], [784.3, 279.3, "end"],
  [809.2, 219.8, "end"], [1146.5, 318.1, "start"], [912, 790.4, "middle"], [624.7, 768.9, "middle"],
];
// Where the ship parks (scaled down) while a deck is open.
const PARK = { x: 235, y: 305, k: 0.4 };
// Cutaway placement: drawn around (830,470), enlarged and shifted into the centre.
const CUT = { k: 1.25, tx: -150, ty: 30, cornerX: 636, cornerY: 484 };
const cutX = (x: number) => 830 + (x - 830) * CUT.k + CUT.tx;
const cutY = (y: number) => 470 + (y - 470) * CUT.k + CUT.ty;
const parkedX = (x: number) => 880 + (x - 880) * PARK.k + (PARK.x - 880);
const parkedY = (y: number) => 455 + (y - 455) * PARK.k + (PARK.y - 455);

// Dashed connector from the parked deck ring to the cutaway corner — right angles only (H–V–H).
function connectorPath(stage: number) {
  const [x, y] = DOTS[stage - 1];
  return `M${parkedX(x).toFixed(1)} ${parkedY(y).toFixed(1)}H400V${cutY(CUT.cornerY).toFixed(1)}H${cutX(CUT.cornerX).toFixed(1)}`;
}

// Deck cutaway for one stage. Remounted per stage so lines redraw and the slice beam runs once.
function Cutaway({ stage, label }: { stage: number; label: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    // Astronauts walk via SMIL, which CSS can't stop — freeze them for reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current?.pauseAnimations();
  }, [stage]);
  return (
    <div className="sceneIn pointer-events-none absolute inset-0 z-[3]">
      <svg
        ref={ref}
        role="img"
        aria-label={label}
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 overflow-visible"
        style={{ transformOrigin: "830px 470px", transform: `translate(${CUT.tx}px,${CUT.ty}px) scale(${CUT.k})` }}
        fill="none"
        dangerouslySetInnerHTML={{ __html: SCENES[stage - 1] }}
      />
    </div>
  );
}

function useStageScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

const Arrow = () => (
  <svg width="22" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M0 5h20M16 1l4 4-4 4" />
  </svg>
);

export default function ShipScene() {
  const { language, setLanguage } = useLanguage();
  const t = sceneContent[language];
  const scale = useStageScale();
  // 0 = hero, 1..8 = open deck; ?stage=N deep-links straight into a deck
  const [sel, setSel] = useState(() => {
    const n = Number(new URLSearchParams(window.location.search).get("stage"));
    return Number.isInteger(n) && n >= 1 && n <= 8 ? n : 0;
  });
  const open = sel > 0;
  const cur = t.stages[(sel || 1) - 1];

  const go = useCallback((i: number) => setSel(i), []);
  const prev = () => setSel((s) => (s <= 1 ? 8 : s - 1));
  const next = () => setSel((s) => (s >= 8 ? 1 : s + 1));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel(0);
      if (e.key === "ArrowRight") setSel((s) => (s >= 8 ? 1 : s + 1));
      if (e.key === "ArrowLeft") setSel((s) => (s <= 1 ? 8 : s - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const shipTransform = open
    ? `translate(${PARK.x - 880}px,${PARK.y - 455}px) scale(${PARK.k})`
    : "translate(0px,-48px)";

  return (
    <div id="top" className="sx relative h-[100svh] min-h-[560px] w-full overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(38% 46% at 61% 50%,#A855F744 0%,rgba(7,9,11,0) 72%),radial-gradient(30% 36% at 40% 86%,#EC489933 0%,rgba(7,9,11,0) 72%),radial-gradient(28% 34% at 90% 22%,#3B82F633 0%,rgba(7,9,11,0) 70%)",
        }}
      />

      <div
        className="absolute left-1/2 top-1/2"
        style={{ width: W, height: H, transform: `translate(-50%,-50%) scale(${scale})`, transformOrigin: "center" }}
      >
        {/* Star streaks drifting down-left */}
        <svg aria-hidden="true" width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0" fill="none" dangerouslySetInnerHTML={{ __html: STARS }} />

        {/* Ship */}
        <svg role="img" aria-label={t.shipLabel} width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 overflow-visible" fill="none">
          <defs dangerouslySetInnerHTML={{ __html: DEFS }} />
          <g transform="translate(0,-48)" style={{ opacity: open ? 0 : 1, transition: "opacity .6s ease" }}>
            <g mask="url(#gm)">
              <g className="gmv" dangerouslySetInnerHTML={{ __html: GRID }} />
            </g>
          </g>
          <g className="scene-move" style={{ transformOrigin: "880px 455px", transform: shipTransform, transition: `transform 1s ${EASE}` }}>
            <g className="shipg" dangerouslySetInnerHTML={{ __html: SHIP }} />
            {DOTS.map(([cx, cy], i) => (
              <circle key={i} className="hl" cx={cx} cy={cy} r={22} style={{ opacity: sel === i + 1 ? 1 : 0 }} />
            ))}
            <g style={{ opacity: open ? 0 : 1, transition: "opacity .5s ease" }} dangerouslySetInnerHTML={{ __html: LEADS }} />
          </g>
        </svg>

        {/* Open deck: cutaway + connector */}
        {open && <Cutaway key={sel} stage={sel} label={`${t.stage.cut}: ${cur.name}`} />}
        <svg
          aria-hidden="true"
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{ opacity: open ? 1 : 0, transition: open ? "opacity .6s ease .5s" : "opacity .3s" }}
          fill="none"
        >
          {open && (
            <>
              <path d={connectorPath(sel)} stroke="url(#lgc)" strokeWidth="1.4" strokeDasharray="4 6" className="dsh" />
              <circle cx={cutX(CUT.cornerX)} cy={cutY(CUT.cornerY)} r="4" fill="var(--sx-accent-ink)" />
            </>
          )}
        </svg>

        {/* Stage labels — real buttons around the ship */}
        {LABELS.map(([x, y, anchor], i) => (
          <button
            key={i}
            type="button"
            className="hit"
            onClick={() => go(i + 1)}
            tabIndex={open ? -1 : 0}
            style={{
              left: x,
              top: y - 17 - 48,
              zIndex: 4,
              color: i === 2 ? "var(--sx-accent-ink)" : "var(--sx-ink)",
              opacity: open ? 0 : 1,
              pointerEvents: open ? "none" : "auto",
              transform: anchor === "end" ? "translateX(-100%)" : anchor === "middle" ? "translateX(-50%)" : "none",
            }}
          >
            {t.stages[i].num} {t.stages[i].label}
          </button>
        ))}

        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-14 py-[26px]">
          <a href="#top" className="flex items-baseline gap-1.5" aria-label="SABAISHEV.ONLINE">
            <span style={{ fontWeight: 300, fontSize: 21, letterSpacing: ".42em" }}>SABAISHEV</span>
            <span className="mono gt" style={{ fontSize: 11, letterSpacing: ".14em" }}>.ONLINE</span>
          </a>
          <nav className="flex items-center gap-[38px]">
            <Link href="/legacy" className="nv">{t.nav.services}</Link>
            <Link href="/legacy" className="nv">{t.nav.cases}</Link>
            <button type="button" className="nv" onClick={() => go(1)}>{t.nav.process}</button>
            <Link href="/legacy" className="nv">{t.nav.experience}</Link>
          </nav>
          <div className="flex items-center gap-[22px]">
            <div className="flex" role="group" aria-label="Language">
              {(["ru", "en", "th"] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  className="lg"
                  aria-pressed={language === l}
                  onClick={() => setLanguage(l)}
                  style={language === l ? { background: "rgba(255,255,255,.12)" } : { opacity: 0.55 }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="pill" style={{ padding: "13px 22px", font: "600 12px var(--font-tight)", letterSpacing: ".02em" }}>
              {t.cta.project}
            </a>
          </div>
        </header>

        {/* Hero copy */}
        <div
          className="absolute z-[5] max-w-[560px]"
          style={{
            left: 56,
            bottom: 64,
            transition: "opacity .5s ease, transform .6s ease",
            opacity: open ? 0 : 1,
            transform: open ? "translateX(40px)" : "none",
            pointerEvents: open ? "none" : "auto",
          }}
          aria-hidden={open}
        >
          <div className="flex items-center gap-4">
            <span className="mono gt" style={{ fontSize: 11, letterSpacing: ".14em" }}>01</span>
            <span className="block h-px w-16" style={{ background: "var(--sx-grad)" }} />
            <span className="mono uppercase" style={{ fontSize: 11, letterSpacing: ".14em", color: "rgba(241,238,232,.7)" }}>{t.hero.eyebrow}</span>
          </div>
          <h1 style={{ margin: "22px 0 0", fontSize: 76, lineHeight: 0.94, fontWeight: 500, letterSpacing: "-.055em" }}>
            {t.hero.title.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
            <span className="gt">{t.hero.accent}</span>
          </h1>
          <p style={{ margin: "24px 0 0", maxWidth: 470, fontSize: 18, lineHeight: 1.5, letterSpacing: "-.01em", color: "rgba(241,238,232,.82)" }}>
            {t.hero.subtitle}
          </p>
          <div className="mt-8 flex items-center gap-8">
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="pill" tabIndex={open ? -1 : 0} style={{ padding: "19px 30px", font: "600 15px var(--font-tight)", boxShadow: "0 14px 44px -12px var(--sx-c2)" }}>
              {t.cta.task}
              <Arrow />
            </a>
            <Link href="/legacy" className="mono uppercase" tabIndex={open ? -1 : 0} style={{ fontSize: 11, letterSpacing: ".14em", borderBottom: "1px solid rgba(241,238,232,.5)", padding: "8px 0", color: "rgba(241,238,232,.88)" }}>
              {t.cta.cases}
            </Link>
          </div>
        </div>

        {/* Hint */}
        <div
          className="mono pointer-events-none absolute z-[5] flex items-center gap-3 uppercase"
          style={{ right: 56, bottom: 56, fontSize: 10.5, letterSpacing: ".16em", color: "rgba(241,238,232,.72)", opacity: open ? 0 : 1, transition: "opacity .4s" }}
        >
          <span className="pd" />
          {t.hint}
        </div>

        {/* Open deck: info block */}
        <section
          aria-live="polite"
          aria-hidden={!open}
          className="absolute z-[6] w-[330px]"
          style={{
            left: 1060,
            top: 190,
            transition: "opacity .6s ease .25s, transform .7s ease .25s",
            opacity: open ? 1 : 0,
            transform: open ? "none" : "translateX(40px)",
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <div className="flex items-center gap-4">
            <span className="mono gt uppercase" style={{ fontSize: 11, letterSpacing: ".14em" }}>{t.stage.cut}</span>
            <span className="block h-px w-16" style={{ background: "var(--sx-grad)" }} />
            <span className="mono uppercase" style={{ fontSize: 11, letterSpacing: ".14em", color: "rgba(241,238,232,.7)" }}>
              {cur.num} {t.stage.of} 08
            </span>
          </div>
          <div className="gt" style={{ marginTop: 20, fontSize: 104, lineHeight: 0.8, fontWeight: 400, letterSpacing: "-.08em", fontVariantNumeric: "tabular-nums" }}>{cur.num}</div>
          <h2 style={{ margin: "18px 0 0", fontSize: 44, lineHeight: 1, fontWeight: 500, letterSpacing: "-.05em" }}>{cur.name}</h2>
          <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: 1.5, letterSpacing: "-.01em", color: "rgba(241,238,232,.82)" }}>{cur.lead}</p>
          <div className="mono uppercase" style={{ marginTop: 24, fontSize: 10, letterSpacing: ".16em", color: "rgba(241,238,232,.55)" }}>{t.stage.output}</div>
          <ul className="mt-2.5 flex flex-col gap-2">
            {cur.items.map((it) => (
              <li key={it} className="flex items-center gap-3" style={{ fontSize: 15, letterSpacing: "-.005em" }}>
                <i className="block h-1.5 w-1.5 flex-none rounded-full" style={{ background: "var(--sx-grad)" }} />
                {it}
              </li>
            ))}
          </ul>
          <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="pill mt-[26px]" tabIndex={open ? 0 : -1} style={{ padding: "15px 24px", font: "600 14px var(--font-tight)" }}>
            {t.cta.stage}
            <Arrow />
          </a>
        </section>

        {/* Open deck: glass navigation */}
        <nav
          aria-label={t.nav.process}
          aria-hidden={!open}
          className="glass absolute bottom-10 left-1/2 z-[7] flex items-center gap-[18px] rounded-full px-3 py-2.5"
          style={{
            transform: "translateX(-50%)",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            transition: open ? "opacity .6s ease .5s" : "opacity .3s",
          }}
        >
          <button type="button" className="nb nbp" onClick={prev} aria-label={t.stage.prev} tabIndex={open ? 0 : -1}>
            <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 6H2M7 1L2 6l5 5" /></svg>
          </button>
          <div className="flex items-center gap-1.5">
            {t.stages.map((s, i) => (
              <button
                key={s.num}
                type="button"
                className={`sg${i + 1 < sel ? " done" : ""}`}
                aria-label={`${s.num} ${s.name}`}
                aria-current={i + 1 === sel ? "step" : undefined}
                onClick={() => go(i + 1)}
                tabIndex={open ? 0 : -1}
              />
            ))}
          </div>
          <div className="mono min-w-[112px] uppercase" style={{ fontSize: 10.5, letterSpacing: ".14em", color: "rgba(241,238,232,.82)" }}>
            {cur.num} · {cur.name}
          </div>
          <button type="button" className="nb nbn" onClick={next} aria-label={t.stage.next} tabIndex={open ? 0 : -1}>
            <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 6h19M15 1l5 5-5 5" /></svg>
          </button>
          <button type="button" className="ib" onClick={() => go(0)} tabIndex={open ? 0 : -1}>✕ {t.stage.close}</button>
        </nav>
      </div>
    </div>
  );
}
