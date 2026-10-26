import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PROCESS_BIZ_IDS, useBrief } from "@/brief/BriefContext";
import SiteHeader from "@/scene/SiteHeader";
import WarpBackground from "@/scene/WarpBackground";
import { H, W, useStageScale } from "@/scene/stage";
import { processContent, STAGE_DOCS, STAGE_WEEKS, type ProcessCopy, type StageDoc } from "./content";
import "@/scene/scene.css";
import "./process.css";

// Process page: one scene. The Gantt is laid out from the start as an outline of the path;
// the left panel first asks which business you run, then gives way to the first layer and
// the Gantt opens layer by layer. Each layer plays in order — playhead and ship move, the row and its bar
// grow, the panel changes, the output code types — and the documents behind the Gantt follow
// the code: each output item shows its own document as it is typed.

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const COL = 70; // px per week
const GX = 150; // gantt timeline x (after row labels)
const CODE_START = 1.0; // s after a layer change: playhead, row and panel go first
const DOC_CYCLE = 3800;
const AUTOPLAY = 5200;

// ---------- Output code ----------
type Part = { t: string; k?: "k1" | "k2" | "k3" };
type CodeLine = { parts: Part[]; n: number; dur: number; delay: number; gap?: boolean };
type Code = { lines: CodeLine[]; docAt: number[]; insideLine: number[] };

// Builds the output object from text segments (not HTML), with per-line typing timings.
// docAt: when each output item starts typing — that's when its document comes up.
function buildCode(copy: ProcessCopy, stage: number): Code {
  const st = copy.stages[stage - 1];
  const k = copy.code;
  const I = "  ";
  const lines: CodeLine[] = [];
  let at = CODE_START;
  const add = (parts: Part[], gap = false) => {
    const n = parts.map((p) => p.t).join("").length + 1;
    const dur = Math.max(0.3, n * 0.026);
    lines.push({ parts, n, dur, delay: at, gap });
    at += dur + 0.06;
  };
  add([{ t: "const", k: "k1" }, { t: ` ${k.out} ` }, { t: "=", k: "k3" }, { t: " {" }]);
  add([{ t: `${I}${k.doc}` }, { t: ":", k: "k3" }, { t: " " }, { t: `"${st.out.doc}"`, k: "k2" }, { t: ",", k: "k3" }]);
  add([{ t: `${I}${k.inside}` }, { t: ":", k: "k3" }, { t: " " }, { t: "[", k: "k2" }]);
  const insideLine: number[] = [];
  const docAt: number[] = [];
  st.out.inside.forEach((item) => {
    insideLine.push(lines.length);
    docAt.push(at);
    add([{ t: `${I}${I}` }, { t: `"${item}"`, k: "k2" }, { t: ",", k: "k3" }]);
  });
  add([{ t: I }, { t: "]", k: "k2" }, { t: ",", k: "k3" }]);
  add([{ t: `${I}${k.can}` }, { t: ":", k: "k3" }, { t: " " }, { t: `"${st.out.can}"`, k: "k2" }]);
  add([{ t: "}" }]);
  if (st.proof) add([{ t: `// ${k.proof}: ${st.proof}`, k: "k3" }], true);
  return { lines, docAt, insideLine };
}

// ---------- Documents behind the Gantt ----------
function Placeholder() {
  const bar = (left: number, top: number, width: number, height: number, a: number, r = 4) => (
    <div className="absolute" style={{ left, top, width, height, borderRadius: r, background: `rgba(241,238,232,${a})` }} />
  );
  return (
    <div className="absolute inset-0">
      {bar(190, 34, 230, 26, 0.5, 5)}
      {bar(190, 80, 330, 9, 0.3)}{bar(190, 98, 290, 9, 0.3)}{bar(190, 116, 310, 9, 0.3)}
      {bar(190, 160, 200, 150, 0.18, 10)}{bar(406, 160, 200, 150, 0.12, 10)}{bar(622, 160, 200, 150, 0.16, 10)}
      {bar(190, 340, 400, 9, 0.26)}{bar(190, 358, 360, 9, 0.26)}{bar(190, 376, 380, 9, 0.26)}
      {bar(620, 340, 200, 110, 0.12, 10)}
      {bar(190, 420, 300, 9, 0.22)}{bar(190, 438, 340, 9, 0.22)}
    </div>
  );
}
function DocLayer({ doc, mode }: { doc: StageDoc; mode: "enter" | "leave" }) {
  return (
    <div className={`doc ${mode}`}>
      {doc.img ? (
        <>
          <img src={doc.img} alt="" className={doc.light ? "light" : undefined} loading="lazy" decoding="async" />
          <div className="tint" />
        </>
      ) : (
        <div className="ph"><Placeholder /></div>
      )}
      {mode === "enter" && <div className="scanline" />}
    </div>
  );
}

// stage 0 = nothing shown yet (the first document comes up with the first output item).
// ?biz=N (1–5) opens that business right away, ?layer=N (1–7) a layer — e.g. for ads per niche.
function fromQuery(key: string, max: number) {
  const n = Number(new URLSearchParams(window.location.search).get(key));
  return Number.isInteger(n) && n >= 1 && n <= max ? n : 0;
}

type DocState = { stage: number; idx: number; key: number; prev?: { stage: number; idx: number; key: number } };

export default function ProcessScene() {
  const { language } = useLanguage();
  const copy = processContent[language];
  const { openBrief } = useBrief();
  const scale = useStageScale();
  const [picking, setPicking] = useState(0); // business being picked: the question slides out
  const [biz, setBiz] = useState(() => fromQuery("biz", 5)); // 0 = asking, 1..5 = chosen business
  const [sel, setSel] = useState(() => fromQuery("layer", 7) || 1); // current layer 1..7
  const [tn, setTn] = useState(0); // transition counter: restarts layer animations
  const [auto, setAuto] = useState(false);
  const [doc, setDoc] = useState<DocState>({ stage: 0, idx: 0, key: 0 });
  const [lit, setLit] = useState(-1);
  const wheelAt = useRef(0);

  const run = biz > 0;
  const B = copy.biz[(biz || 1) - 1];
  const st = copy.stages[sel - 1];
  const weeks = STAGE_WEEKS[sel - 1];
  // Before a business is chosen the playhead waits at the start of the timeline.
  const endW = run ? weeks.s + weeks.d : 0;
  const code = useMemo(() => buildCode(copy, sel), [copy, sel]);
  const fast = reduced();

  const goLayer = (n: number) => { setSel(n); setTn((t) => t + 1); };
  const next = () => goLayer(sel >= 7 ? 1 : sel + 1);
  const prev = () => goLayer(sel <= 1 ? 7 : sel - 1);
  const pick = (i: number) => {
    if (picking) return;
    setPicking(i);
    window.setTimeout(() => { setBiz(i); setPicking(0); goLayer(1); }, fast ? 0 : 450);
  };
  const chooseBiz = (i: number) => { setBiz(i); goLayer(1); };

  // Documents follow the code: each output item brings up its document as it types,
  // then the three documents keep cycling.
  useEffect(() => {
    if (!run) return;
    const timers: number[] = [];
    const show = (idx: number, light = true) => {
      setDoc((d) => (d.stage === sel && d.idx === idx ? d : { stage: sel, idx, key: d.key + 1, prev: d.stage ? { stage: d.stage, idx: d.idx, key: d.key } : undefined }));
      setLit(light ? code.insideLine[idx] : -1);
    };
    if (fast) { show(0); return; }
    setLit(-1);
    // The stage's document comes up with the `document:` line; each output item then lights up and shows its own.
    timers.push(window.setTimeout(() => show(0, false), code.lines[1].delay * 1000));
    code.docAt.forEach((t, idx) => timers.push(window.setTimeout(() => show(idx), t * 1000)));
    const done = code.lines[code.lines.length - 1];
    let idx = 2;
    timers.push(window.setTimeout(() => {
      const id = window.setInterval(() => { idx = (idx + 1) % 3; show(idx); }, DOC_CYCLE);
      timers.push(id);
    }, (done.delay + done.dur) * 1000 + DOC_CYCLE));
    return () => timers.forEach((id) => { window.clearTimeout(id); window.clearInterval(id); });
  }, [run, sel, tn, code, fast]);

  // Autoplay through the layers (off by default).
  useEffect(() => {
    if (!run || !auto) return;
    const id = window.setInterval(() => { setSel((s) => (s >= 7 ? 1 : s + 1)); setTn((t) => t + 1); }, AUTOPLAY);
    return () => window.clearInterval(id);
  }, [run, auto, tn]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!run || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
      goLayer(Math.max(1, Math.min(7, sel + (e.key === "ArrowRight" ? 1 : -1))));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (!run || now - wheelAt.current < 700) return;
    wheelAt.current = now;
    const n = Math.max(1, Math.min(7, sel + (e.deltaY > 0 ? 1 : -1)));
    if (n !== sel) goLayer(n);
  };

  const docsOf = (stage: number) => STAGE_DOCS[stage - 1];
  const curDoc = doc.stage ? docsOf(doc.stage)[doc.idx] : null;

  return (
    <div className="sx relative h-[100svh] min-h-[560px] w-full overflow-hidden">
      <div className="absolute left-1/2 top-1/2" style={{ width: W, height: H, transform: `translate(-50%,-50%) scale(${scale})` }}>
        <WarpBackground />
        <SiteHeader active="process" />
        <div className="mono absolute z-[7] flex items-center gap-3.5 uppercase" style={{ left: 70, top: 92, fontSize: 10.5, letterSpacing: ".18em", color: "rgba(241,238,232,.7)" }}>
          <span className="gt">03</span>
          <span className="block h-px w-11" style={{ background: "var(--sx-grad)" }} />
          {copy.eyebrow}
        </div>
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <linearGradient id="bzg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#EC4899" /><stop offset=".5" stopColor="#A855F7" /><stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>

        {/* First the question: which business — on the left, where the layer panel will be */}
        {!run && (
          <div className={`absolute z-[7]${picking ? " asking-out" : ""}`} style={{ left: 70, top: 150, width: 410, animation: fast ? undefined : "pnIn .8s cubic-bezier(.2,.9,.25,1) .2s both" }}>
            <h2 style={{ margin: 0, fontSize: 52, lineHeight: 0.98, fontWeight: 500, letterSpacing: "-.06em" }}>
              {copy.title}<span className="gt">{copy.accent}</span>
            </h2>
            <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: 1.5, color: "rgba(241,238,232,.74)" }}>{copy.lead}</p>
            <div className="mt-7 flex flex-col">
              {copy.biz.map((b, i) => (
                <button key={b.name} type="button" className={`bzrow${picking === i + 1 ? " on" : ""}`} onClick={() => pick(i + 1)} style={{ animationDelay: `${0.45 + i * 0.07}s` }}>
                  <span className="mono gt" style={{ fontSize: 10.5, letterSpacing: ".14em" }}>0{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block" style={{ fontSize: 21, fontWeight: 500, letterSpacing: "-.035em" }}>{b.name}</span>
                    <span className="block" style={{ marginTop: 2, fontSize: 13, color: "rgba(241,238,232,.55)" }}>{b.hint}</span>
                    <span className="pain">«{b.p[0][0]}»</span>
                  </span>
                  <span className="arr" aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stage documents behind the Gantt, following the code */}
        <div aria-hidden="true" className="showcase">
          {doc.prev && <DocLayer key={`d${doc.prev.key}`} doc={docsOf(doc.prev.stage)[doc.prev.idx]} mode="leave" />}
          {curDoc && <DocLayer key={`d${doc.key}`} doc={curDoc} mode="enter" />}
          <div className="scanlines" />
          {curDoc && (
            <div key={`cap${doc.key}`} className="mono absolute uppercase" style={{ right: 18, bottom: 14, fontSize: 9.5, letterSpacing: ".16em", color: "rgba(241,238,232,.75)", animation: "fdu .5s ease both" }}>
              {copy.docOfStage} · {doc.idx + 1} / 3 · <span style={{ textTransform: "none" }}>{curDoc.name}</span>
            </div>
          )}
        </div>

        {/* Gantt */}
        <div onWheel={onWheel} className="absolute z-[6]" style={{ left: 520, top: 150, width: 850, height: 560 }}>
          <div className="mono absolute flex" style={{ left: GX, top: 0, right: 0, height: 26, fontSize: 9.5, letterSpacing: ".14em", color: "rgba(241,238,232,.5)" }}>
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="flex-none" style={{ width: COL, color: i >= weeks.s && i < endW ? "var(--sx-ink)" : undefined, transition: "color .5s" }}>W{i + 1}</span>
            ))}
          </div>
          <div className="absolute" style={{ left: GX, top: 26, width: 700, height: 500, backgroundImage: "linear-gradient(90deg,rgba(241,238,232,.07) 1px,transparent 1px)", backgroundSize: `${COL}px 100%`, borderTop: "1px solid rgba(241,238,232,.2)" }} />
          <div className="absolute" style={{ left: GX, top: 26, width: 700, height: 500, backgroundImage: "linear-gradient(rgba(241,238,232,.035) 1px,transparent 1px)", backgroundSize: "100% 66px" }} />
          {/* Playhead and the ship riding it */}
          <div className="absolute z-[5] w-px" style={{ top: 8, height: 518, left: GX + endW * COL, background: "linear-gradient(180deg,#A855F7,transparent)", transition: fast ? undefined : "left .9s cubic-bezier(.6,0,.2,1)" }} />
          <div className="absolute z-[6]" style={{ top: -30, left: GX + endW * COL - 15, transition: fast ? undefined : "left .9s cubic-bezier(.6,0,.2,1)", animation: "bz 2.4s ease-in-out infinite" }}>
            <svg key={`ship-${tn}`} className="ship-go" width="30" height="16" viewBox="0 0 30 16" fill="none" stroke="#F1EEE8" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true" style={{ overflow: "visible", filter: "drop-shadow(0 0 8px #A855F7)", animation: "shipgo .9s ease-out both", transformOrigin: "15px 8px" }}>
              <path className="flame" d="M1 8L-9 5v6z" fill="url(#bzg)" stroke="none" style={{ transformOrigin: "1px 8px", animation: "flame .9s ease-out both" }} />
              <path d="M1 8L11 2h16l2 6-2 6H11z" />
              <path d="M11 2v12M5 8h6" />
            </svg>
          </div>
          {copy.stages.map((s, i) => {
            const k = i + 1;
            // Before a business is chosen every row is an outline of the path ahead.
            const ghost = !run;
            const shown = ghost || k <= sel;
            const act = run && k === sel;
            const w = STAGE_WEEKS[i];
            return (
              <button
                key={i}
                type="button"
                className="rw"
                disabled={ghost || !shown || act}
                onClick={() => goLayer(k)}
                tabIndex={!ghost && shown && !act ? 0 : -1}
                aria-label={`0${k} ${s.name}`}
                style={{ top: 38 + i * 66, cursor: !ghost && shown && !act ? "pointer" : "default", opacity: ghost ? 0.55 : shown ? 1 : 0, transform: shown ? "none" : "translateX(-26px)", transitionDelay: ghost ? `${0.3 + i * 0.06}s` : shown ? ".35s" : "0s" }}
              >
                <span className="absolute flex flex-col items-end justify-center text-right" style={{ left: 0, top: 0, width: 140, height: 40 }}>
                  <span className={`mono${act ? " gt" : ""}`} style={{ fontSize: 9.5, letterSpacing: ".14em", color: act ? undefined : "rgba(241,238,232,.5)" }}>0{k}</span>
                  <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-.03em", color: act ? "var(--sx-ink)" : "rgba(241,238,232,.62)" }}>{s.name}</span>
                </span>
                <span
                  className="absolute block overflow-hidden"
                  style={{
                    left: GX + w.s * COL + 3, top: 6, height: 28, borderRadius: 8,
                    width: shown ? w.d * COL - 6 : 0,
                    transition: fast ? undefined : "width 1s cubic-bezier(.6,0,.2,1) .55s, background .5s, box-shadow .5s, outline-color .5s",
                    background: ghost ? "transparent" : act ? "var(--sx-grad)" : "linear-gradient(110deg,#EC489966,#A855F755,#3B82F666)",
                    boxShadow: ghost ? "none" : act ? "0 0 30px -4px #A855F7,0 0 0 1px rgba(255,255,255,.35) inset" : "0 0 0 1px rgba(255,255,255,.12) inset",
                    outline: `1px dashed ${ghost ? "rgba(196,139,250,.45)" : "transparent"}`, outlineOffset: -1,
                  }}
                >
                  {act && <i className="absolute inset-y-0 w-10" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent)", animation: "scn 2.4s linear infinite" }} />}
                </span>
              </button>
            );
          })}
          <div className="mono absolute uppercase" style={{ left: GX, top: 556, fontSize: 9.5, letterSpacing: ".16em", color: "rgba(241,238,232,.45)" }}>{copy.weeksNote}</div>
        </div>

        {run && (
          <>
            {/* Business chips */}
            <div className="absolute z-[7] flex items-center gap-2" style={{ right: 70, top: 90, animation: "fdu .6s ease both" }}>
              <span className="mono mr-1.5 uppercase" style={{ fontSize: 10, letterSpacing: ".14em", color: "rgba(241,238,232,.5)" }}>{copy.business}</span>
              {copy.biz.map((b, i) => (
                <button key={i} type="button" className="bc" aria-pressed={biz === i + 1} onClick={() => chooseBiz(i + 1)}>{b.name}</button>
              ))}
            </div>

            {/* Layer panel */}
            <div key={`panel-${tn}`} className="absolute z-[7] w-[400px]" style={{ left: 70, top: 150, animation: fast ? undefined : "pnIn .8s cubic-bezier(.2,.9,.25,1) .45s both" }}>
              <div className="flex items-center gap-3">
                <span className="mono gt uppercase" style={{ fontSize: 11, letterSpacing: ".14em" }}>{copy.stage} 0{sel} / 07</span>
                <span className="block h-px w-9" style={{ background: "var(--sx-grad)" }} />
                <span className="mono" style={{ fontSize: 10.5, letterSpacing: ".14em", color: "rgba(241,238,232,.62)" }}>W{weeks.s + 1}{weeks.d > 1 ? `–W${weeks.s + weeks.d}` : ""}</span>
              </div>
              <h2 className="gt" style={{ margin: "14px 0 0", fontSize: st.name.length > 11 ? 48 : 62, lineHeight: 0.95, fontWeight: 500, letterSpacing: "-.06em" }}>{st.name}</h2>
              <div className="mono uppercase" style={{ marginTop: 26, fontSize: 10, letterSpacing: ".16em", color: "rgba(241,238,232,.5)" }}>{copy.familiar}</div>
              <div style={{ marginTop: 7, fontSize: 21, lineHeight: 1.25, letterSpacing: "-.02em" }}>«{B.p[sel - 1][0]}»</div>
              <div className="mono gt uppercase" style={{ marginTop: 22, fontSize: 10, letterSpacing: ".16em" }}>{copy.whatIDo}</div>
              <div style={{ marginTop: 7, fontSize: 16, lineHeight: 1.45, color: "rgba(241,238,232,.82)" }}>{B.p[sel - 1][1]}</div>
              <div className="mono gt uppercase" style={{ marginTop: 26, fontSize: 10, letterSpacing: ".16em" }}>{copy.output}</div>
              <div style={{ marginTop: 10, padding: "14px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,.12)", background: "rgba(10,12,20,.5)" }}>
                {code.lines.map((l, i) => (
                  <span
                    key={i}
                    className={`tl${lit === i ? " lit" : ""}`}
                    style={{ ["--n" as string]: l.n, animation: `typL ${l.dur.toFixed(2)}s steps(${l.n}) ${l.delay.toFixed(2)}s forwards`, marginTop: l.gap ? 8 : undefined }}
                  >
                    {l.parts.map((p, j) => <span key={j} className={p.k}>{p.t}</span>)}
                  </span>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="absolute z-[7] flex items-center justify-between" style={{ left: 70, right: 70, bottom: 46 }}>
              <div className="flex items-center gap-3.5">
                <button type="button" className="rb" onClick={prev} aria-label={copy.prevLayer}>
                  <svg width="18" height="10" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 6H2M7 1L2 6l5 5" /></svg>
                </button>
                <button type="button" className="cta2" onClick={next}>
                  {sel >= 7 ? copy.restart : copy.next}
                  <svg width="20" height="10" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 6h19M15 1l5 5-5 5" /></svg>
                </button>
                <button type="button" className="nx" aria-pressed={auto} onClick={() => setAuto((a) => !a)}>
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d={auto ? "M3 1.5h3v11H3zM8 1.5h3v11H8z" : "M3 1.5v11l9-5.5z"} /></svg>
                  {auto ? copy.autoOn : copy.autoOff}
                </button>
                <span className="mono uppercase" style={{ fontSize: 10, letterSpacing: ".16em", color: "rgba(241,238,232,.5)" }}>{copy.layer} 0{sel} / 07 · {B.name}</span>
              </div>
              <button type="button" className="cta2 ghost" onClick={() => openBrief(`${B.name} · ${copy.stage} 0${sel} · ${st.name}`, { biz: PROCESS_BIZ_IDS[biz - 1] })}>
                {copy.discuss}
                <svg width="22" height="12" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 6h19M15 1l5 5-5 5" /></svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
