import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { sceneContent, TELEGRAM_URL } from "../sceneContent";
import { DEFS, GRID, LEADS, SCENES, SHIP, STARS } from "../shipMarkup";
import { DOTS, H, LABELS, W, useStageScale } from "../ShipScene";
import "../scene.css";

// Prototype: entering a deck = the camera flies into the ship. The room opens as a cutaway
// in place, inside the hull; the rest of the ship stays as a dimmed backdrop and the other
// decks remain as glowing accents you can fly to.

const EASE = "cubic-bezier(.65,0,.2,1)";
const FLY = 1.1; // seconds
const K = 2.4; // camera zoom inside a deck
const FOCUS = { x: 600, y: 470 }; // where the open deck lands on screen (left of the info card)
// Room cutaways are drawn around the floor centre (871.5, 508); scaled to sit inside the deck.
const ROOM = { cx: 871.5, cy: 508, k: 0.5 };
const SHIP_DY = -48; // ship is drawn shifted up in the hero
const DECKS = DOTS.slice(0, 8); // the 8 stage decks (DOTS[8] is the bridge)

// Decks whose anchor lands under the open room are hidden — only decks around it stay as accents.
const ROOM_HALF = { x: 300, y: 230 };
const outsideRoom = (px: number, py: number) => Math.abs(px - FOCUS.x) > ROOM_HALF.x || Math.abs(py - FOCUS.y) > ROOM_HALF.y;

function camera(sel: number) {
  if (!sel) return { tx: 0, ty: 0, k: 1 };
  const [x, y] = DOTS[sel - 1];
  return { tx: FOCUS.x - K * x, ty: FOCUS.y - K * (y + SHIP_DY), k: K };
}

export default function ZoomScene() {
  const { language } = useLanguage();
  const t = sceneContent[language];
  const scale = useStageScale();
  const [sel, setSel] = useState(0);
  // The room appears once the camera has (almost) arrived; keyed per deck so it redraws.
  const [roomFor, setRoomFor] = useState(0);
  const swingRef = useRef<HTMLDivElement>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const inside = sel > 0;
  const cam = camera(sel);
  const stage = t.stages[(sel || 1) - 1];

  useEffect(() => {
    setRoomFor(0);
    if (!sel) return;
    const id = window.setTimeout(() => setRoomFor(sel), reduced ? 0 : FLY * 650);
    // A short "banking" swing while the camera travels, so the ship feels like it turns to meet us.
    if (!reduced) {
      swingRef.current?.animate(
        [
          { transform: "rotateX(0deg) rotateZ(0deg)" },
          { transform: "rotateX(14deg) rotateZ(-2.5deg)", offset: 0.45 },
          { transform: "rotateX(0deg) rotateZ(0deg)" },
        ],
        { duration: FLY * 1000, easing: "ease-in-out" },
      );
    }
    return () => window.clearTimeout(id);
  }, [sel, reduced]);

  useEffect(() => {
    if (!inside) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel(0);
      if (e.key === "ArrowRight") setSel((s) => (s >= 8 ? 1 : s + 1));
      if (e.key === "ArrowLeft") setSel((s) => (s <= 1 ? 8 : s - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inside]);

  const move = reduced ? "none" : `transform ${FLY}s ${EASE}`;
  const follow = reduced ? "none" : `left ${FLY}s ${EASE}, top ${FLY}s ${EASE}, opacity .4s ease`;
  const [rx, ry] = sel ? DOTS[sel - 1] : [0, 0];

  return (
    <div className="sx relative h-[100svh] min-h-[560px] w-full overflow-hidden">
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

        {/* Camera rig: perspective swing wraps the zoom/pan */}
        <div className="absolute inset-0" style={{ perspective: 1400 }}>
          <div ref={swingRef} className="absolute inset-0" style={{ transformOrigin: `${FOCUS.x}px ${FOCUS.y}px` }}>
            <svg role="img" aria-label={inside ? `${t.stage.cut}: ${stage.name}` : t.shipLabel} width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 overflow-visible" fill="none">
              <defs>
                <g dangerouslySetInnerHTML={{ __html: DEFS }} />
                <radialGradient id="zbk" cx=".5" cy=".5" r=".5">
                  <stop offset="0" stopColor="#07090B" stopOpacity=".96" />
                  <stop offset=".7" stopColor="#07090B" stopOpacity=".85" />
                  <stop offset="1" stopColor="#07090B" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g style={{ transform: `translate(${cam.tx}px,${cam.ty}px) scale(${cam.k})`, transformOrigin: "0 0", transition: move }}>
                {/* Ship: full in the hero, a dimmed soft backdrop once we're inside */}
                <g
                  transform={`translate(0,${SHIP_DY})`}
                  style={{
                    opacity: inside ? 0.32 : 1,
                    filter: inside ? "blur(1.2px)" : "none",
                    transition: reduced ? "none" : `opacity ${FLY}s ease, filter ${FLY}s ease`,
                  }}
                >
                  <g mask="url(#gm)" style={{ opacity: inside ? 0 : 1, transition: "opacity .6s" }}>
                    <g className="gmv" dangerouslySetInnerHTML={{ __html: GRID }} />
                  </g>
                  <g className="shipg" dangerouslySetInnerHTML={{ __html: SHIP }} />
                  <g style={{ opacity: inside ? 0 : 1, transition: "opacity .4s" }} dangerouslySetInnerHTML={{ __html: LEADS }} />
                </g>

                {/* Accent rings on the other decks — still visible from inside */}
                {DECKS.map(([x, y], d) =>
                  inside && d !== sel - 1 && outsideRoom(cam.tx + cam.k * x, cam.ty + cam.k * (y + SHIP_DY)) ? (
                    <circle key={d} cx={x} cy={y + SHIP_DY} r={6} fill="none" stroke="url(#lgc)" strokeWidth={1.2} opacity={0.9} />
                  ) : null,
                )}

                {/* The open deck, cut away in place inside the hull */}
                {inside && (
                  <g transform={`translate(${rx} ${ry + SHIP_DY})`}>
                    <ellipse cx={0} cy={4} rx={190} ry={130} fill="url(#zbk)" style={{ opacity: roomFor ? 1 : 0, transition: "opacity .5s ease" }} />
                    {roomFor === sel && (
                      <g key={roomFor} className="sceneIn" transform={`scale(${ROOM.k}) translate(${-ROOM.cx} ${-ROOM.cy})`} dangerouslySetInnerHTML={{ __html: SCENES[sel - 1] }} />
                    )}
                  </g>
                )}
              </g>
            </svg>

            {/* Deck buttons: labels around the ship in the hero, accent chips on other decks inside */}
            {DECKS.map(([x, y], d) => {
              const n = d + 1;
              const [lx, ly, anchor] = LABELS[d];
              const px = inside ? cam.tx + cam.k * x : lx;
              const py = inside ? cam.ty + cam.k * (y + SHIP_DY) - 26 : ly - 17 + SHIP_DY;
              const visible = inside ? n !== sel && px > 40 && px < 960 && py > 90 && py < 820 && outsideRoom(px, py + 26) : true;
              return (
                <button
                  key={d}
                  type="button"
                  className="hit"
                  onClick={() => setSel(n)}
                  tabIndex={visible ? 0 : -1}
                  style={{
                    left: px,
                    top: py,
                    zIndex: 4,
                    fontSize: inside ? 10 : 11,
                    color: inside ? "rgba(241,238,232,.62)" : n === 3 ? "var(--sx-accent-ink)" : "var(--sx-ink)",
                    opacity: visible ? 1 : 0,
                    pointerEvents: visible ? "auto" : "none",
                    transform: inside ? "translateX(-50%)" : anchor === "end" ? "translateX(-100%)" : anchor === "middle" ? "translateX(-50%)" : "none",
                    transition: follow,
                  }}
                >
                  {t.stages[d].num} {t.stages[d].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Brand + hero copy (fades while inside) */}
        <div className="absolute left-14 top-[26px] z-10 flex items-baseline gap-1.5">
          <button type="button" onClick={() => setSel(0)} className="flex items-baseline gap-1.5" style={{ background: "none", border: 0, cursor: "pointer" }} aria-label="SABAISHEV.ONLINE">
            <span style={{ fontWeight: 300, fontSize: 21, letterSpacing: ".42em" }}>SABAISHEV</span>
            <span className="mono gt" style={{ fontSize: 11, letterSpacing: ".14em" }}>.ONLINE</span>
          </button>
          <span className="mono ml-6 uppercase" style={{ fontSize: 10, letterSpacing: ".16em", color: "rgba(241,238,232,.45)" }}>prototype · camera</span>
        </div>
        <div className="absolute z-[5] max-w-[560px]" style={{ left: 56, bottom: 64, opacity: inside ? 0 : 1, transform: inside ? "translateX(-30px)" : "none", transition: "opacity .5s, transform .6s", pointerEvents: inside ? "none" : "auto" }}>
          <h1 style={{ margin: 0, fontSize: 76, lineHeight: 0.94, fontWeight: 500, letterSpacing: "-.055em" }}>
            {t.hero.title.map((line) => <span key={line} className="block">{line}</span>)}
            <span className="gt">{t.hero.accent}</span>
          </h1>
          <p className="mono mt-8 uppercase" style={{ fontSize: 10.5, letterSpacing: ".16em", color: "rgba(241,238,232,.72)" }}>{t.hint}</p>
        </div>

        {/* Inside a deck: info card on the right */}
        <section
          aria-live="polite"
          aria-hidden={!inside}
          className="glass absolute z-[6] w-[380px] rounded-[26px] p-7"
          style={{
            left: 1010,
            top: 170,
            opacity: roomFor ? 1 : 0,
            transform: roomFor ? "none" : "translateY(14px)",
            transition: "opacity .5s ease .15s, transform .6s ease .15s",
            pointerEvents: roomFor ? "auto" : "none",
          }}
        >
          <div className="flex items-center gap-4">
            <span className="mono gt uppercase" style={{ fontSize: 11, letterSpacing: ".14em" }}>{t.stage.cut}</span>
            <span className="mono uppercase" style={{ fontSize: 11, letterSpacing: ".14em", color: "rgba(241,238,232,.7)" }}>{stage.num} {t.stage.of} 08</span>
          </div>
          <div className="gt" style={{ marginTop: 16, fontSize: 84, lineHeight: 0.8, letterSpacing: "-.08em" }}>{stage.num}</div>
          <h2 style={{ margin: "14px 0 0", fontSize: 38, lineHeight: 1, fontWeight: 500, letterSpacing: "-.05em" }}>{stage.name}</h2>
          <p style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.5, color: "rgba(241,238,232,.82)" }}>{stage.lead}</p>
          <ul className="mt-4 flex flex-col gap-2">
            {stage.items.map((it) => (
              <li key={it} className="flex items-center gap-3" style={{ fontSize: 14 }}>
                <i className="block h-1.5 w-1.5 flex-none rounded-full" style={{ background: "var(--sx-grad)" }} />
                {it}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-2">
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="pill" style={{ padding: "13px 20px", font: "600 13px var(--font-tight)" }}>{t.cta.stage}</a>
            <button type="button" className="nb nbp" onClick={() => setSel((s) => (s <= 1 ? 8 : s - 1))} aria-label={t.stage.prev}>
              <svg width="18" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M21 6H2M7 1L2 6l5 5" /></svg>
            </button>
            <button type="button" className="nb nbn" onClick={() => setSel((s) => (s >= 8 ? 1 : s + 1))} aria-label={t.stage.next}>
              <svg width="18" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 6h19M15 1l5 5-5 5" /></svg>
            </button>
          </div>
          <button type="button" className="ib mt-4" onClick={() => setSel(0)}>✕ {t.stage.close}</button>
        </section>
      </div>
    </div>
  );
}
