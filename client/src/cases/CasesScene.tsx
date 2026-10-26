import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import SiteHeader from "@/scene/SiteHeader";
import { H, W, useStageScale } from "@/scene/ShipScene";
import WarpBackground from "@/scene/WarpBackground";
import { CASE_MEDIA, casesContent } from "./content";
import "@/scene/scene.css";
import "./cases.css";

// Cases page per CHANGES-2: four live projects as a browser + phone over the flight
// background, autoplaying every 7 s. Switching a project is a short "signal change":
// the stars jump, the screens glitch, and the new project comes in part by part —
// browser, phone, then the caption.

const COUNT = CASE_MEDIA.length;
// Entrance order of a slide's parts (seconds after the switch).
const STAGE = { browser: 0, phone: 0.15, head: 0.22, name: 0.3, desc: 0.38, tags: 0.46, cta: 0.54 };

function initialCase() {
  const n = Number(new URLSearchParams(window.location.search).get("case"));
  return Number.isInteger(n) && n >= 1 && n <= COUNT ? n : 1;
}

export default function CasesScene() {
  const { language } = useLanguage();
  const copy = casesContent[language];
  const scale = useStageScale();
  const [sel, setSel] = useState(initialCase);
  const [switches, setSwitches] = useState(0); // drives the star jump and the glitch burst
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(false);
  const halted = paused || hover || hidden;

  const go = (n: number) => {
    if (n === sel) return;
    setSel(n);
    setSwitches((s) => s + 1);
  };
  const next = () => go(sel >= COUNT ? 1 : sel + 1);
  const prev = () => go(sel <= 1 ? COUNT : sel - 1);

  // Autoplay stops while the tab is hidden.
  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className={`sx relative h-[100svh] min-h-[560px] w-full overflow-hidden${halted ? " paused" : ""}`}>
      <div className="absolute left-1/2 top-1/2" style={{ width: W, height: H, transform: `translate(-50%,-50%) scale(${scale})` }}>
        <WarpBackground count={78} jump={switches} />
        <SiteHeader active="cases" />

        <div className="mono absolute z-[7] flex items-center gap-3.5 uppercase" style={{ left: 70, top: 92, fontSize: 10.5, letterSpacing: ".18em", color: "rgba(241,238,232,.7)" }}>
          <span className="gt">02</span>
          <span className="block h-px w-11" style={{ background: "var(--sx-grad)" }} />
          {copy.eyebrow}
        </div>
        <div className="mono absolute z-[7] flex items-center gap-3 uppercase" style={{ right: 70, top: 92, fontSize: 10.5, letterSpacing: ".18em", color: "rgba(241,238,232,.7)" }}>
          <span className="rec block h-[7px] w-[7px] rounded-full" style={{ background: "#EC4899", boxShadow: "0 0 10px #EC4899" }} />
          {copy.onAir} · 0{sel} / 0{COUNT}
        </div>

        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <filter id="glf1" x="-4%" y="-4%" width="108%" height="108%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.0006 0.085" numOctaves={1} seed={3} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={48} xChannelSelector="R" yChannelSelector="G" result="d" />
              <feColorMatrix in="d" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r" />
              <feOffset in="r" dx={-7} result="ro" />
              <feColorMatrix in="d" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g" />
              <feColorMatrix in="d" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b" />
              <feOffset in="b" dx={7} result="bo" />
              <feBlend in="ro" in2="g" mode="screen" result="rg" />
              <feBlend in="rg" in2="bo" mode="screen" />
            </filter>
            <filter id="glf2" x="-4%" y="-4%" width="108%" height="108%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.0004 0.2" numOctaves={1} seed={9} result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={26} xChannelSelector="R" yChannelSelector="G" result="d" />
              <feColorMatrix in="d" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r" />
              <feOffset in="r" dx={5} result="ro" />
              <feColorMatrix in="d" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g" />
              <feColorMatrix in="d" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b" />
              <feOffset in="b" dx={-5} result="bo" />
              <feBlend in="ro" in2="g" mode="screen" result="rg" />
              <feBlend in="rg" in2="bo" mode="screen" />
            </filter>
          </defs>
        </svg>

        {CASE_MEDIA.map((m, i) => {
          const k = i + 1;
          const on = k === sel;
          const text = copy.cases[i];
          const stage = (sd: number): React.CSSProperties => ({ ["--sd" as string]: `${sd}s` });
          return (
            <section key={m.slug} className={`cs${on ? " on" : ""}`} aria-hidden={!on} style={{ ["--dir" as string]: k < sel ? -1 : 1, zIndex: on ? 3 : 2 }}>
              <div className="glow absolute inset-0" style={{ background: `radial-gradient(60% 80% at 72% 50%,${m.hue}55 0%,rgba(9,11,18,0) 70%)` }} />

              {/* Browser */}
              <div
                className="st absolute overflow-hidden"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{ ...stage(STAGE.browser), right: 64, top: 160, width: 790, height: 540, borderRadius: 12, border: "1px solid rgba(255,255,255,.18)", background: "#0A0C14", boxShadow: `0 30px 80px -20px #000,0 0 90px -30px ${m.hue}` }}
              >
                <div className="flex items-center gap-1.5 px-3.5" style={{ height: 30, background: "rgba(14,16,26,.98)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                  <i className="block h-2 w-2 rounded-full" style={{ background: "#EC4899" }} />
                  <i className="block h-2 w-2 rounded-full" style={{ background: "#A855F7" }} />
                  <i className="block h-2 w-2 rounded-full" style={{ background: "#3B82F6" }} />
                  <div className="mono ml-3 flex items-center whitespace-nowrap rounded-[9px] px-3" style={{ height: 18, background: "rgba(255,255,255,.07)", fontSize: 9.5, letterSpacing: ".05em", color: "rgba(241,238,232,.75)" }}>{m.host}</div>
                </div>
                <div key={on ? `b${switches}` : "b"} className={`gs relative overflow-hidden${on && switches ? " gx" : ""}`} style={{ height: 510 }}>
                  {m.desktop ? (
                    <div className={`shot${m.still ? " still" : ""}`} style={{ ["--vh" as string]: "510px" }}>
                      <img src={m.desktop} alt={`${copy.screenshot} ${text.name}`} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
                    </div>
                  ) : (
                    <div style={{ padding: "34px 40px" }}>
                      <div className="mono uppercase" style={{ fontSize: 10, letterSpacing: ".2em", color: "rgba(241,238,232,.4)" }}>{copy.placeholder}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div
                className="st absolute overflow-hidden"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{ ...stage(STAGE.phone), right: 760, top: 330, width: 170, height: 350, borderRadius: 26, border: "1px solid rgba(255,255,255,.3)", background: "#0A0C14", boxShadow: `0 30px 70px -16px #000,0 0 70px -20px ${m.hue}`, zIndex: 2 }}
              >
                <div className="absolute z-[3] rounded" style={{ left: "50%", top: 8, width: 54, height: 6, marginLeft: -27, background: "rgba(255,255,255,.18)" }} />
                <div key={on ? `p${switches}` : "p"} className={`gs b absolute inset-0 overflow-hidden${on && switches ? " gx" : ""}`}>
                  {m.mobile && (
                    <div className={`shot phone${m.still ? " still" : ""}`} style={{ ["--vh" as string]: "350px" }}>
                      <img src={m.mobile} alt="" loading={i === 0 ? "eager" : "lazy"} decoding="async" />
                    </div>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div className="absolute z-[4] flex flex-col justify-center" style={{ left: 90, top: 60, bottom: 0, width: 340 }}>
                <div className="st flex items-center gap-3" style={stage(STAGE.head)}>
                  <span className="mono gt" style={{ fontSize: 11, letterSpacing: ".14em" }}>0{k}</span>
                  <span className="mono uppercase" style={{ fontSize: 10.5, letterSpacing: ".14em", color: "rgba(241,238,232,.7)" }}>{text.type}</span>
                </div>
                <h2 className="st" style={{ ...stage(STAGE.name), margin: "14px 0 0", fontSize: 76, lineHeight: 0.92, fontWeight: 500, letterSpacing: "-.06em" }}>{text.name}</h2>
                <p className="st" style={{ ...stage(STAGE.desc), margin: "20px 0 0", fontSize: 16, lineHeight: 1.5, color: "rgba(241,238,232,.84)" }}>{text.desc}</p>
                <ul className="st mt-[18px] flex flex-wrap gap-1.5" style={stage(STAGE.tags)}>
                  {text.tags.map((tag) => (
                    <li key={tag} className="mono" style={{ padding: "5px 10px", border: "1px solid rgba(255,255,255,.26)", borderRadius: 999, fontSize: 9.5, letterSpacing: ".08em", color: "rgba(241,238,232,.86)" }}>{tag}</li>
                  ))}
                </ul>
                <div className="st mt-[26px] flex items-center gap-4" style={stage(STAGE.cta)}>
                  <a className="opn" href={m.url} target="_blank" rel="noopener noreferrer" tabIndex={on ? 0 : -1}>
                    {copy.open}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 11L11 3M5 3h6v6" /></svg>
                  </a>
                  <span className="mono uppercase" style={{ fontSize: 10, letterSpacing: ".14em", color: "rgba(241,238,232,.6)" }}>{text.status}</span>
                </div>
              </div>
            </section>
          );
        })}

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]" style={{ background: "repeating-linear-gradient(0deg,rgba(255,255,255,.02) 0 1px,transparent 1px 3px)" }} />

        {/* Minimal controls */}
        <button type="button" className="eg egl" onClick={prev} aria-label={copy.prevAria}><span><i />{copy.prev}</span></button>
        <button type="button" className="eg egr" onClick={next} aria-label={copy.nextAria}><span>{copy.next}<i /></span></button>
        <div className="absolute z-[8] flex items-center gap-3.5" style={{ left: "50%", bottom: 34, transform: "translateX(-50%)" }}>
          <button type="button" className="nb" onClick={() => setPaused((p) => !p)} aria-label={paused ? copy.play : copy.pause} aria-pressed={paused} style={{ width: 38, height: 38 }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d={paused ? "M3 1.5v11l9-5.5z" : "M3 1.5h3v11H3zM8 1.5h3v11H8z"} /></svg>
          </button>
          {CASE_MEDIA.map((m, i) => (
            <button key={m.slug} type="button" className="tk" aria-current={i + 1 === sel} aria-label={copy.cases[i].name} onClick={() => go(i + 1)}>
              <b>0{i + 1} {copy.cases[i].name}</b>
              {/* Re-keyed per switch so the 7 s bar restarts; when it fills, the next project comes up. */}
              <i key={i + 1 === sel ? `kb${switches}` : "kb"} className="kb" onAnimationEnd={i + 1 === sel ? next : undefined} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
