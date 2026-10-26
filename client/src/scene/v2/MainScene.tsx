import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/content";
import { sceneContent, TELEGRAM_URL } from "../sceneContent";
import { DOTS, H, LABELS, W, useStageScale } from "../ShipScene";
import { sceneV2Content, type Deliverable } from "./content";
import { DEFS, GRID, LEADS, ROOM_TRANSFORM, ROOMS, SHIP, STARS } from "./markup";
import "../scene.css";
import "./v2.css";

// Main scene per CHANGES-2: clicking a deck dives the camera into the ship (×5 from the deck),
// the ship fades and that deck's room appears, surrounded by blurred ghost rooms. Moving
// between decks plays one of six entrance animations; deliverables are code cards.

const DECKS = DOTS.slice(0, 8);
const DECK_ANIMS = ["deckA", "deckB", "deckC", "deckD", "deckE", "deckF"];

type Nav = { sel: number; last: number; tn: number; dir: number; fromHero: boolean };

function Arrow() {
  return (
    <svg width="22" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M0 5h20M16 1l4 4-4 4" />
    </svg>
  );
}

// One deliverable: number, title and a ">" at rest; on hover/focus it slides out and types
// its description as code comments plus the format it returns.
// Visuals are driven by CSS :hover/:focus (as in the mockup); state only feeds aria-expanded.
function CodeCard({ d, num, top, delay }: { d: Deliverable; num: number; top: number; delay: number }) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const lines = [
    { n: d.why[0].length + 3, delay: 0, body: <span className="k3">// {d.why[0]}</span> },
    { n: d.why[1].length + 3, delay: 0.45, body: <span className="k3">// {d.why[1]}</span> },
    { n: d.ret.length + 10, delay: 0.9, body: <><span className="k1">return</span> <span className="k2">"{d.ret}"</span></> },
  ];
  return (
    <button
      type="button"
      className="cc"
      aria-expanded={hover || focus}
      style={{ top, animation: `v2in .7s ease ${delay}s both` }}
      // Mobile Safari doesn't focus buttons on tap; focus explicitly so a tap opens the card.
      onClick={(e) => e.currentTarget.focus()}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="flex h-11 items-center gap-3 pl-[18px] pr-4">
        <span className="mono gt" style={{ fontSize: 11, letterSpacing: ".1em" }}>{String(num).padStart(2, "0")}</span>
        <span className="flex-1 whitespace-nowrap" style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-.02em", color: "var(--sx-ink)" }}>{d.title}</span>
        <span className="mono ch" aria-hidden="true" style={{ fontSize: 12, color: "rgba(241,238,232,.5)" }}>&gt;</span>
      </span>
      <span className="bd block">
        <span className="block pb-4 pl-[18px] pr-4 pt-1">
          {lines.map((l, i) => (
            <span key={i} className="cl" style={{ ["--n" as string]: l.n, ["--d" as string]: `${l.delay}s` }}>{l.body}</span>
          ))}
        </span>
      </span>
    </button>
  );
}

export default function MainScene() {
  const { language, setLanguage } = useLanguage();
  const t = sceneContent[language];
  const v = sceneV2Content[language];
  const scale = useStageScale();
  const [nav, setNav] = useState<Nav>(() => {
    const n = Number(new URLSearchParams(window.location.search).get("stage"));
    const sel = Number.isInteger(n) && n >= 1 && n <= 8 ? n : 0;
    return { sel, last: sel || 1, tn: 0, dir: 0, fromHero: true };
  });
  const { sel, last, tn, dir, fromHero } = nav;
  const open = sel > 0;
  const stage = v.stages[(sel || 1) - 1];
  const room = ROOMS[(sel || 1) - 1];

  const go = (i: number) =>
    setNav((s) => ({ sel: i, last: i || s.last, tn: s.tn + 1, dir: i > s.sel ? 1 : -1, fromHero: s.sel === 0 }));
  const up = () => go(sel >= 8 ? 1 : sel + 1);
  const down = () => go(sel <= 1 ? 8 : sel - 1);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") go(0);
      if (e.key === "ArrowUp" || e.key === "ArrowRight") { e.preventDefault(); up(); }
      if (e.key === "ArrowDown" || e.key === "ArrowLeft") { e.preventDefault(); down(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Entering from the ship: the room grows in after the dive. Between decks: one of six
  // directions (by transition count and direction), ghosts drift the other way.
  const deckAnim = fromHero
    ? "deckIn 1.1s cubic-bezier(.2,.8,.2,1) .5s both"
    : `${DECK_ANIMS[(tn + (dir > 0 ? 0 : 3)) % 6]} 1.15s cubic-bezier(.2,.9,.25,1.05) both`;
  const ghostAnim = `${tn % 2 ? "ghA" : "ghB"} 1.5s ease both`;
  const roomHtml = open
    ? `<g class="room-anim" style="animation:${ghostAnim};transform-origin:830px 470px">${room.ghosts}</g>` +
      `<g class="room-anim" style="animation:${deckAnim};transform-origin:830px 470px"><g class="roomg">${room.room}<text class="wn" transform="matrix(.866 .5 0 1 943.6 352.8)" font-size="74">${stage.num}</text></g></g>`
    : "";
  const [lx, ly] = DECKS[last - 1];
  const key = `${sel}-${tn}`;

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
      <div className="absolute left-1/2 top-1/2" style={{ width: W, height: H, transform: `translate(-50%,-50%) scale(${scale})` }}>
        <svg aria-hidden="true" width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0" fill="none" dangerouslySetInnerHTML={{ __html: STARS }} />

        {/* Ship: dives ×5 into the chosen deck and fades */}
        <svg role="img" aria-label={t.shipLabel} aria-hidden={open} width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 overflow-visible" fill="none">
          <defs dangerouslySetInnerHTML={{ __html: DEFS }} />
          <g transform="translate(0,-48)">
            <g mask="url(#gm)">
              <g className="gmv" dangerouslySetInnerHTML={{ __html: GRID }} />
            </g>
          </g>
          <g
            className="dive"
            style={{
              opacity: open ? 0 : 1,
              transformOrigin: `${lx}px ${ly}px`,
              transform: open ? "translate(0px,-48px) scale(5)" : "translate(0px,-48px)",
              transition: "transform 1.2s cubic-bezier(.7,0,.25,1), opacity .7s ease .55s",
            }}
          >
            <g className="shipg" dangerouslySetInnerHTML={{ __html: SHIP }} />
            <g style={{ opacity: open ? 0 : 1, transition: "opacity .5s ease" }} dangerouslySetInnerHTML={{ __html: LEADS }} />
          </g>
        </svg>

        {/* Room of the open deck with ghost rooms around it */}
        {open && (
          <svg
            key={`room-${key}`}
            role="img"
            aria-label={`${v.cut}: ${stage.name}`}
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            className="pointer-events-none absolute inset-0 z-[3] overflow-visible"
            style={{ transformOrigin: "830px 470px", transform: ROOM_TRANSFORM }}
            fill="none"
            dangerouslySetInnerHTML={{ __html: roomHtml }}
          />
        )}

        {/* Stage labels around the ship */}
        {LABELS.map(([x, y, anchor], d) => (
          <button
            key={d}
            type="button"
            className="hit"
            onClick={() => go(d + 1)}
            tabIndex={open ? -1 : 0}
            style={{
              left: x,
              top: y - 17 - 48,
              zIndex: 4,
              color: d === 2 ? "var(--sx-accent-ink)" : "var(--sx-ink)",
              opacity: open ? 0 : 1,
              pointerEvents: open ? "none" : "auto",
              transform: anchor === "end" ? "translateX(-100%)" : anchor === "middle" ? "translateX(-50%)" : "none",
            }}
          >
            {t.stages[d].num} {t.stages[d].label}
          </button>
        ))}

        {open && (
          <>
            {/* Pain → solution, bottom-left */}
            <div key={`pain-${key}`} className="v2in absolute z-[6] w-[430px]" style={{ left: 56, bottom: 56 }}>
              <div className="flex items-center gap-3.5">
                <span className="mono gt uppercase" style={{ fontSize: 11, letterSpacing: ".14em" }}>{v.stageOf} {stage.num} / 08</span>
                <span className="block h-px w-11" style={{ background: "var(--sx-grad)" }} />
                <span className="mono" style={{ fontSize: 11, letterSpacing: ".14em", color: "rgba(241,238,232,.62)" }}>{stage.tag}</span>
              </div>
              <h2 className="gt" style={{ margin: "14px 0 0", fontSize: stage.name.length < 9 ? 64 : 48, lineHeight: 0.95, fontWeight: 500, letterSpacing: "-.06em" }}>{stage.name}</h2>
              <div className="mono uppercase" style={{ marginTop: 20, fontSize: 10, letterSpacing: ".16em", color: "rgba(241,238,232,.5)" }}>{v.pain}</div>
              <div style={{ marginTop: 6, fontSize: 19, lineHeight: 1.3, letterSpacing: "-.02em", color: "var(--sx-ink)" }}>«{stage.pain}»</div>
              <div className="mono gt uppercase" style={{ marginTop: 16, fontSize: 10, letterSpacing: ".16em" }}>{v.solution}</div>
              <div style={{ marginTop: 6, fontSize: 15, lineHeight: 1.45, color: "rgba(241,238,232,.8)" }}>{stage.solution}</div>
            </div>

            {/* Leader lines from room objects to the cards */}
            <svg key={`lead-${key}`} aria-hidden="true" width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="sceneIn pointer-events-none absolute inset-0 z-[4] overflow-visible" fill="none" dangerouslySetInnerHTML={{ __html: room.leaders }} />

            {/* What you get: code cards */}
            <div key={`cards-${key}`} className="cw pointer-events-none absolute inset-0 z-[7]">
              <div className="mono absolute z-[7]" style={{ left: 1072, top: 100, fontSize: 10.5, letterSpacing: ".14em", color: "rgba(241,238,232,.62)", animation: "v2in .7s ease .5s both" }}>
                <span className="k1">const</span> {v.get} <span className="k3">=</span> <span className="k2">[</span>
                <span className="gt">{stage.items.length}</span>
                <span className="k2">]</span>
                <span className="k3"> // {v.hint}</span>
              </div>
              {room.cards.map((c) => (
                <CodeCard key={c.item} d={stage.items[c.item]} num={c.item + 1} top={c.top} delay={c.delay} />
              ))}
            </div>

            <div key={`sweep-${key}`} aria-hidden="true" className="sweep pointer-events-none absolute inset-0 z-[5]" />

            {/* Deck rail, left */}
            <nav aria-label={v.decks} className="absolute z-[6] flex flex-col" style={{ left: 56, top: 122, animation: "v2in .8s ease .9s both" }}>
              <button type="button" className="ib self-start" style={{ padding: "8px 12px", marginBottom: 16 }} onClick={() => go(0)}>{v.toShip}</button>
              <div className="mono uppercase" style={{ fontSize: 9.5, letterSpacing: ".16em", color: "rgba(241,238,232,.5)", marginBottom: 8 }}>{v.decks}</div>
              {[...v.stages].reverse().map((s) => {
                const n = Number(s.num);
                return (
                  <button key={s.num} type="button" className="rl" aria-current={n === sel ? "step" : undefined} onClick={() => n !== sel && go(n)}>
                    <i />
                    <span>{s.num}</span>
                    {s.name}
                  </button>
                );
              })}
              <div className="mt-3.5 flex gap-2">
                <button type="button" className="nb nbp" style={{ width: 40, height: 40 }} onClick={up} aria-label={v.up}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 12V2M2.5 6.5L7 2l4.5 4.5" /></svg>
                </button>
                <button type="button" className="nb nbp" style={{ width: 40, height: 40 }} onClick={down} aria-label={v.down}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 2v10M2.5 7.5L7 12l4.5-4.5" /></svg>
                </button>
              </div>
            </nav>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="pill absolute z-[6]"
              style={{ right: 56, bottom: 48, padding: "15px 24px", font: "600 14px var(--font-tight)", animation: "v2in .6s ease 1.2s both" }}
            >
              {v.discussStage}
              <Arrow />
            </a>
          </>
        )}

        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-14 py-[26px]">
          <a href="#top" onClick={() => open && go(0)} className="flex items-baseline gap-1.5" aria-label="SABAISHEV.ONLINE">
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
                <button key={l} type="button" className="lg" aria-pressed={language === l} onClick={() => setLanguage(l)} style={language === l ? { background: "rgba(255,255,255,.12)" } : { opacity: 0.55 }}>
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
          aria-hidden={open}
          style={{ left: 56, bottom: 64, transition: "opacity .5s ease, transform .6s ease", opacity: open ? 0 : 1, transform: open ? "translateX(40px)" : "none", pointerEvents: open ? "none" : "auto" }}
        >
          <div className="flex items-center gap-4">
            <span className="mono gt" style={{ fontSize: 11, letterSpacing: ".14em" }}>01</span>
            <span className="block h-px w-16" style={{ background: "var(--sx-grad)" }} />
            <span className="mono uppercase" style={{ fontSize: 11, letterSpacing: ".14em", color: "rgba(241,238,232,.7)" }}>{t.hero.eyebrow}</span>
          </div>
          <h1 style={{ margin: "22px 0 0", fontSize: 76, lineHeight: 0.94, fontWeight: 500, letterSpacing: "-.055em" }}>
            {t.hero.title.map((line) => <span key={line} className="block">{line}</span>)}
            <span className="gt">{t.hero.accent}</span>
          </h1>
          <p style={{ margin: "24px 0 0", maxWidth: 470, fontSize: 18, lineHeight: 1.5, letterSpacing: "-.01em", color: "rgba(241,238,232,.82)" }}>{t.hero.subtitle}</p>
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

        {!open && (
          <div className="mono pointer-events-none absolute z-[5] flex items-center gap-3 uppercase" style={{ right: 56, bottom: 56, fontSize: 10.5, letterSpacing: ".16em", color: "rgba(241,238,232,.72)" }}>
            <span className="pd" />
            {t.hint}
          </div>
        )}
      </div>
    </div>
  );
}
