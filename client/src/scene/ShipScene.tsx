import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { content, type Language } from "@/lib/content";
import { sceneContent, TELEGRAM_URL } from "./sceneContent";
import { DEFS, GALLERY, GRID, LEADS, SCENES, SHIP, STARS } from "./shipMarkup";
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
// The case gallery lives on the lowest deck.
const GALLERY_DOT = 0;
// Where the ship parks (scaled down) while a room is open.
const PARK = { x: 235, y: 305, k: 0.4 };
// Room placement: drawn around (830,470), enlarged and shifted into the centre.
const CUT = { k: 1.25, tx: -150, ty: 30, cornerX: 636, cornerY: 484 };
const cutX = (x: number) => 830 + (x - 830) * CUT.k + CUT.tx;
const cutY = (y: number) => 470 + (y - 470) * CUT.k + CUT.ty;
const parkedX = (x: number) => 880 + (x - 880) * PARK.k + (PARK.x - 880);
const parkedY = (y: number) => 455 + (y - 455) * PARK.k + (PARK.y - 455);

// Dashed connector from the parked deck ring to the room corner — right angles only (H–V–H).
function connectorPath(dot: number) {
  const [x, y] = DOTS[dot];
  return `M${parkedX(x).toFixed(1)} ${parkedY(y).toFixed(1)}H400V${cutY(CUT.cornerY).toFixed(1)}H${cutX(CUT.cornerX).toFixed(1)}`;
}

// Gallery panels: base colour per exhibit; the selected one gets a stronger fill and a frame.
const PANEL_COLORS = ["#EC4899", "#A855F7", "#3B82F6", "#EC4899", "#A855F7", "#3B82F6"];
function galleryMarkup(selected: number) {
  return GALLERY.replace(/\{\{(fc|fo|so)([1-6])\}\}/g, (_, kind: string, n: string) => {
    const i = Number(n);
    if (kind === "fc") return PANEL_COLORS[i - 1];
    if (kind === "fo") return selected === i ? "0.7" : "0.16";
    return selected === i ? "1" : "0";
  });
}

type Product = {
  id: string; number: string; name: string; type: string; status: string; progress: number;
  link: string | null; tags: string[]; cardDescription: string; challenge: string; role: string;
};

// A room inside the ship (deck cutaway or case gallery). Remount it to redraw lines and rerun the slice beam.
function Room({ html, label }: { html: string; label: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    // Astronauts walk via SMIL, which CSS can't stop — freeze them for reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) ref.current?.pauseAnimations();
  }, []);
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
        dangerouslySetInnerHTML={{ __html: html }}
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

// Fades a block in/out with a horizontal slide; hidden blocks are inert.
function reveal(shown: boolean, delay = 0.25): React.CSSProperties {
  return {
    transition: `opacity .6s ease ${shown ? delay : 0}s, transform .7s ease ${shown ? delay : 0}s`,
    opacity: shown ? 1 : 0,
    transform: shown ? "none" : "translateX(40px)",
    pointerEvents: shown ? "auto" : "none",
  };
}

// Glass pager at the bottom: arrows, segments, current label, close.
function Pager(props: {
  shown: boolean; label: string; count: number; current: number; itemLabels: string[];
  caption: string; prevLabel: string; nextLabel: string; closeLabel: string;
  onGo: (i: number) => void; onClose: () => void; captionWidth: number;
}) {
  const { shown, count, current, onGo } = props;
  const tab = shown ? 0 : -1;
  return (
    <nav
      aria-label={props.label}
      aria-hidden={!shown}
      className="glass absolute bottom-10 left-1/2 z-[7] flex items-center gap-[18px] rounded-full px-3 py-2.5"
      style={{
        transform: "translateX(-50%)",
        opacity: shown ? 1 : 0,
        pointerEvents: shown ? "auto" : "none",
        transition: shown ? "opacity .6s ease .5s" : "opacity .3s",
      }}
    >
      <button type="button" className="nb nbp" onClick={() => onGo(current <= 1 ? count : current - 1)} aria-label={props.prevLabel} tabIndex={tab}>
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 6H2M7 1L2 6l5 5" /></svg>
      </button>
      <div className="flex items-center gap-1.5">
        {props.itemLabels.map((label, i) => (
          <button
            key={label}
            type="button"
            className={`sg${i + 1 < current ? " done" : ""}`}
            aria-label={label}
            aria-current={i + 1 === current ? "step" : undefined}
            onClick={() => onGo(i + 1)}
            tabIndex={tab}
          />
        ))}
      </div>
      {/* Fixed width so the pager doesn't resize between items */}
      <div className="mono truncate whitespace-nowrap uppercase" style={{ width: props.captionWidth, fontSize: 10.5, letterSpacing: ".14em", color: "rgba(241,238,232,.82)" }}>
        {props.caption}
      </div>
      <button type="button" className="nb nbn" onClick={() => onGo(current >= count ? 1 : current + 1)} aria-label={props.nextLabel} tabIndex={tab}>
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 6h19M15 1l5 5-5 5" /></svg>
      </button>
      <button type="button" className="ib" onClick={props.onClose} tabIndex={tab}>✕ {props.closeLabel}</button>
    </nav>
  );
}

type Mode = "hero" | "stage" | "cases";
type View = { mode: Mode; i: number };
const COUNT: Record<Mode, number> = { hero: 0, stage: 8, cases: 6 };

// ?stage=N / ?case=N deep-link straight into a room.
function initialView(): View {
  const q = new URLSearchParams(window.location.search);
  const stage = Number(q.get("stage"));
  if (Number.isInteger(stage) && stage >= 1 && stage <= 8) return { mode: "stage", i: stage };
  const c = Number(q.get("case"));
  if (Number.isInteger(c) && c >= 1 && c <= 6) return { mode: "cases", i: c };
  return { mode: "hero", i: 0 };
}

export default function ShipScene() {
  const { language, setLanguage } = useLanguage();
  const t = sceneContent[language];
  const products: Product[] = content[language].productModules.products;
  const scale = useStageScale();
  const [view, setView] = useState<View>(initialView);
  const { mode, i } = view;
  const open = mode !== "hero";
  const isStage = mode === "stage";
  const isCases = mode === "cases";

  const stage = t.stages[(isStage ? i : 1) - 1];
  const product = products[(isCases ? i : 1) - 1];
  const ringDot = isStage ? i - 1 : isCases ? GALLERY_DOT : -1;
  const roomHtml = useMemo(() => (isStage ? SCENES[i - 1] : isCases ? galleryMarkup(i) : ""), [isStage, isCases, i]);

  const show = (m: Mode, n = 1) => setView({ mode: m, i: n });
  const close = () => setView({ mode: "hero", i: 0 });

  useEffect(() => {
    if (!open) return;
    const count = COUNT[mode];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setView({ mode: "hero", i: 0 });
      if (e.key === "ArrowRight") setView((v) => ({ ...v, i: v.i >= count ? 1 : v.i + 1 }));
      if (e.key === "ArrowLeft") setView((v) => ({ ...v, i: v.i <= 1 ? count : v.i - 1 }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, mode]);

  const shipTransform = open
    ? `translate(${PARK.x - 880}px,${PARK.y - 455}px) scale(${PARK.k})`
    : "translate(0px,-48px)";
  const navActive = (m: Mode): React.CSSProperties =>
    mode === m ? { opacity: 1, borderBottom: "1px solid var(--sx-accent-ink)" } : {};

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
            {DOTS.map(([cx, cy], d) => (
              <circle key={d} className="hl" cx={cx} cy={cy} r={22} style={{ opacity: ringDot === d ? 1 : 0 }} />
            ))}
            <g style={{ opacity: open ? 0 : 1, transition: "opacity .5s ease" }} dangerouslySetInnerHTML={{ __html: LEADS }} />
          </g>
        </svg>

        {/* Open room + connector */}
        {open && <Room key={`${mode}-${i}`} html={roomHtml} label={isStage ? `${t.stage.cut}: ${stage.name}` : t.cases.label} />}
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
              <path d={connectorPath(ringDot)} stroke="url(#lgc)" strokeWidth="1.4" strokeDasharray="4 6" className="dsh" />
              <circle cx={cutX(CUT.cornerX)} cy={cutY(CUT.cornerY)} r="4" fill="var(--sx-accent-ink)" />
            </>
          )}
        </svg>

        {/* Stage labels — real buttons around the ship */}
        {LABELS.map(([x, y, anchor], n) => (
          <button
            key={n}
            type="button"
            className="hit"
            onClick={() => show("stage", n + 1)}
            tabIndex={open ? -1 : 0}
            style={{
              left: x,
              top: y - 17 - 48,
              zIndex: 4,
              color: n === 2 ? "var(--sx-accent-ink)" : "var(--sx-ink)",
              opacity: open ? 0 : 1,
              pointerEvents: open ? "none" : "auto",
              transform: anchor === "end" ? "translateX(-100%)" : anchor === "middle" ? "translateX(-50%)" : "none",
            }}
          >
            {t.stages[n].num} {t.stages[n].label}
          </button>
        ))}

        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-14 py-[26px]">
          <a href="#top" onClick={close} className="flex items-baseline gap-1.5" aria-label="SABAISHEV.ONLINE">
            <span style={{ fontWeight: 300, fontSize: 21, letterSpacing: ".42em" }}>SABAISHEV</span>
            <span className="mono gt" style={{ fontSize: 11, letterSpacing: ".14em" }}>.ONLINE</span>
          </a>
          <nav className="flex items-center gap-[38px]">
            <Link href="/legacy" className="nv">{t.nav.services}</Link>
            <button type="button" className="nv" style={navActive("cases")} onClick={() => show("cases")}>{t.nav.cases}</button>
            <button type="button" className="nv" style={navActive("stage")} onClick={() => show("stage")}>{t.nav.process}</button>
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
        <div className="absolute z-[5] max-w-[560px]" style={{ left: 56, bottom: 64, ...reveal(!open, 0) }} aria-hidden={open}>
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
            <button type="button" onClick={() => show("cases")} className="mono uppercase" tabIndex={open ? -1 : 0} style={{ background: "none", border: 0, cursor: "pointer", fontSize: 11, letterSpacing: ".14em", borderBottom: "1px solid rgba(241,238,232,.5)", padding: "8px 0", color: "rgba(241,238,232,.88)" }}>
              {t.cta.cases}
            </button>
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

        {/* Stage room: info block */}
        <section aria-live="polite" aria-hidden={!isStage} className="absolute z-[6] w-[330px]" style={{ left: 1060, top: 190, ...reveal(isStage) }}>
          <div className="flex items-center gap-4">
            <span className="mono gt uppercase" style={{ fontSize: 11, letterSpacing: ".14em" }}>{t.stage.cut}</span>
            <span className="block h-px w-16" style={{ background: "var(--sx-grad)" }} />
            <span className="mono uppercase" style={{ fontSize: 11, letterSpacing: ".14em", color: "rgba(241,238,232,.7)" }}>
              {stage.num} {t.stage.of} 08
            </span>
          </div>
          <div className="gt" style={{ marginTop: 20, fontSize: 104, lineHeight: 0.8, fontWeight: 400, letterSpacing: "-.08em", fontVariantNumeric: "tabular-nums" }}>{stage.num}</div>
          <h2 style={{ margin: "18px 0 0", fontSize: 44, lineHeight: 1, fontWeight: 500, letterSpacing: "-.05em" }}>{stage.name}</h2>
          <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: 1.5, letterSpacing: "-.01em", color: "rgba(241,238,232,.82)" }}>{stage.lead}</p>
          <div className="mono uppercase" style={{ marginTop: 24, fontSize: 10, letterSpacing: ".16em", color: "rgba(241,238,232,.55)" }}>{t.stage.output}</div>
          <ul className="mt-2.5 flex flex-col gap-2">
            {stage.items.map((it) => (
              <li key={it} className="flex items-center gap-3" style={{ fontSize: 15, letterSpacing: "-.005em" }}>
                <i className="block h-1.5 w-1.5 flex-none rounded-full" style={{ background: "var(--sx-grad)" }} />
                {it}
              </li>
            ))}
          </ul>
          <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="pill mt-[26px]" tabIndex={isStage ? 0 : -1} style={{ padding: "15px 24px", font: "600 14px var(--font-tight)" }}>
            {t.cta.stage}
            <Arrow />
          </a>
        </section>

        {/* Case gallery: caption bottom-left */}
        <div className="absolute z-[5] max-w-[380px]" style={{ left: 56, bottom: 64, ...reveal(isCases, 0.4) }} aria-hidden={!isCases}>
          <div className="flex items-center gap-4">
            <span className="mono gt" style={{ fontSize: 11, letterSpacing: ".14em" }}>02</span>
            <span className="block h-px w-16" style={{ background: "var(--sx-grad)" }} />
            <span className="mono uppercase" style={{ fontSize: 11, letterSpacing: ".14em", color: "rgba(241,238,232,.7)" }}>{t.cases.eyebrow}</span>
          </div>
          <h2 style={{ margin: "20px 0 0", fontSize: 56, lineHeight: 0.98, fontWeight: 500, letterSpacing: "-.05em" }}>
            <span className="block">{t.cases.title}</span>
            <span className="gt">{t.cases.accent}</span>
          </h2>
          <p style={{ margin: "18px 0 0", maxWidth: 340, fontSize: 16, lineHeight: 1.5, color: "rgba(241,238,232,.8)" }}>{t.cases.lead}</p>
        </div>

        {/* Case gallery: project card */}
        <section aria-live="polite" aria-hidden={!isCases} className="absolute z-[6] w-[330px]" style={{ left: 1060, top: 150, ...reveal(isCases) }}>
          <div className="flex items-center gap-4">
            <span className="mono gt flex-none whitespace-nowrap uppercase" style={{ fontSize: 11, letterSpacing: ".14em" }}>{t.cases.exhibit} {product.number}</span>
            <span className="block h-px w-12 flex-none" style={{ background: "var(--sx-grad)" }} />
            <span className="mono min-w-0 uppercase" style={{ fontSize: 11, lineHeight: 1.4, letterSpacing: ".14em", color: "rgba(241,238,232,.7)" }}>{product.status}</span>
          </div>
          <h2 style={{ margin: "18px 0 0", fontSize: 46, lineHeight: 1, fontWeight: 500, letterSpacing: "-.05em" }}>{product.name}</h2>
          <div style={{ marginTop: 8, fontSize: 14, color: "rgba(241,238,232,.68)" }}>{product.type}</div>
          <p style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.5, color: "rgba(241,238,232,.86)" }}>{product.cardDescription}</p>
          <div className="mono uppercase" style={{ marginTop: 18, fontSize: 10, letterSpacing: ".16em", color: "rgba(241,238,232,.55)" }}>{t.cases.challenge}</div>
          <div style={{ marginTop: 6, fontSize: 13.5, lineHeight: 1.45, color: "rgba(241,238,232,.82)" }}>{product.challenge}</div>
          <div className="mono uppercase" style={{ marginTop: 14, fontSize: 10, letterSpacing: ".16em", color: "rgba(241,238,232,.55)" }}>{t.cases.role}</div>
          <div style={{ marginTop: 6, fontSize: 13.5, lineHeight: 1.45, color: "rgba(241,238,232,.82)" }}>{product.role}</div>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <li key={tag} className="mono" style={{ padding: "5px 9px", border: "1px solid rgba(255,255,255,.2)", borderRadius: 999, fontSize: 9.5, letterSpacing: ".08em", color: "rgba(241,238,232,.78)" }}>{tag}</li>
            ))}
          </ul>
          <div className="mt-[18px] flex items-center gap-3">
            <div className="h-[3px] flex-1 overflow-hidden rounded-sm" style={{ background: "rgba(255,255,255,.16)" }}>
              <div className="h-full" style={{ width: `${product.progress}%`, background: "var(--sx-grad)", transition: "width .6s ease" }} />
            </div>
            <span className="mono" style={{ fontSize: 10.5, letterSpacing: ".1em", color: "rgba(241,238,232,.75)" }}>{product.progress}%</span>
          </div>
          <a
            href={product.link ?? TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="pill mt-[22px]"
            tabIndex={isCases ? 0 : -1}
            style={{ padding: "15px 24px", font: "600 14px var(--font-tight)" }}
          >
            {product.link ? `${t.cases.open} ↗` : t.cases.similar}
            {!product.link && <Arrow />}
          </a>
        </section>

        <Pager
          shown={isStage}
          label={t.nav.process}
          count={8}
          current={isStage ? i : 0}
          itemLabels={t.stages.map((s) => `${s.num} ${s.name}`)}
          caption={`${stage.num} · ${stage.name}`}
          captionWidth={150}
          prevLabel={t.stage.prev}
          nextLabel={t.stage.next}
          closeLabel={t.stage.close}
          onGo={(n) => show("stage", n)}
          onClose={close}
        />
        <Pager
          shown={isCases}
          label={t.nav.cases}
          count={6}
          current={isCases ? i : 0}
          itemLabels={products.map((p) => `${p.number} ${p.name}`)}
          caption={`${product.number} · ${product.name}`}
          captionWidth={210}
          prevLabel={t.cases.prev}
          nextLabel={t.cases.next}
          closeLabel={t.stage.close}
          onGo={(n) => show("cases", n)}
          onClose={close}
        />
      </div>
    </div>
  );
}
