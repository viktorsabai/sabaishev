import { memo, useState } from "react";
import { PROCESS_BIZ_IDS, useBrief } from "@/brief/BriefContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import { processContent } from "@/process/content";
import SiteHeader from "@/scene/SiteHeader";
import { H, W, useStageScale } from "@/scene/stage";
import WarpBackground from "@/scene/WarpBackground";
import { ROOM_TRANSFORM } from "@/scene/v2/markup";
import { roomLayers } from "@/scene/v2/roomLayers";
import { experienceContent } from "./content";
import { ANCHORS, EMPTY, FLOW, FOLDERS, GHOSTS, OBJECTS, PEOPLE, SHELL, WALL } from "./markup";
import "@/scene/scene.css";
import "@/scene/v2/v2.css";
import "./experience.css";

// Experience per CHANGES-2 "Опыт v2": one room in the main scene's style — an archive table
// with three dossier folders (Yandex Market, Sber, Samokat) and an empty dashed one for
// "your product". Cards on the right open like the main scene's code cards and lift their
// folder; the business chips change what each experience gives that business.

// Dossier cards spread around the room rather than stacked in one column:
// Yandex Market top-left, Sber top-right, Samokat lower right, "your product" left.
const CARD_W = 312;
const SPOTS = [{ x: 56, y: 150 }, { x: 1072, y: 150 }, { x: 1072, y: 470 }, { x: 56, y: 340 }];
// Where each leader turns vertically on its way from the folder to its card.
const ELBOW_X = [420, 1040, 1050, 410];
const CARD_X = 1072;
const LAYER_GAP = 0.32;

// Room layers (floor, walls + number, objects in two passes, people), built once.
const { layers, beam } = roomLayers([SHELL, OBJECTS, EMPTY, FLOW, PEOPLE].join("\n"), WALL);
const ld = (i: number) => `${(0.35 + i * LAYER_GAP).toFixed(2)}s`;
const Static = memo(function Static({ html, delay }: { html: string; delay?: string }) {
  return <g className={delay ? "rlay" : undefined} style={delay ? { ["--ld" as string]: delay } : undefined} dangerouslySetInnerHTML={{ __html: html }} />;
});
const FolderArt = memo(function FolderArt({ i }: { i: number }) {
  return <g dangerouslySetInnerHTML={{ __html: FOLDERS[i].replace(/ style="animation-delay:[^;"]*;animation-duration:[^;"]*;/g, ' style="') }} />;
});
const LEADERS = (() => {
  let html = `<path class="ld ldr" pathLength="1" style="animation-delay:2.2s" d="M${CARD_X} 128H1384"/>`;
  ANCHORS.forEach(([ax, ay], r) => {
    const d = (2.35 + r * 0.15).toFixed(2);
    const { x, y } = SPOTS[r];
    const edge = x < W / 2 ? x + CARD_W : x;
    html += `<path class="ld ldr" pathLength="1" style="animation-delay:${d}s" d="M${ax} ${ay}H${ELBOW_X[r]}V${y + 22}H${edge}"/>`;
    html += `<circle class="cd cdr" style="animation-delay:${(Number(d) + 0.45).toFixed(2)}s" cx="${ax}" cy="${ay}" r="3.5"/>`;
  });
  return html;
})();

// Splits text into lines of at most `max` characters.
function wrap(text: string, max: number) {
  const out: string[] = [];
  for (const w of text.split(" ")) {
    const last = out[out.length - 1];
    if (last !== undefined && (last + " " + w).length <= max) out[out.length - 1] = last + " " + w;
    else out.push(w);
  }
  return out;
}

type Line = { n: number; body: React.ReactNode };
function DossierCard({ num, title, lines, spot, delay, dashed, onLift, onClick }: {
  num: string; title: string; lines: Line[]; spot: { x: number; y: number }; delay: number; dashed?: boolean; onLift: (on: boolean) => void; onClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const set = (v: boolean) => { setOpen(v); onLift(v); };
  return (
    <button
      type="button"
      className="cc"
      aria-expanded={open}
      style={{ left: spot.x, top: spot.y, animation: `v2in .7s ease ${delay}s both`, borderStyle: dashed ? "dashed" : undefined }}
      onClick={(e) => { e.currentTarget.focus(); onClick(); }}
      onFocus={() => set(true)}
      onBlur={() => set(false)}
      onMouseEnter={() => set(true)}
      onMouseLeave={() => set(false)}
    >
      <span className="flex h-11 items-center gap-3 pl-[18px] pr-4">
        <span className={`mono${dashed ? "" : " gt"}`} style={{ fontSize: 11, letterSpacing: ".1em", color: dashed ? "rgba(241,238,232,.5)" : undefined }}>{num}</span>
        <span className="flex-1 whitespace-nowrap" style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-.02em", color: "var(--sx-ink)" }}>{title}</span>
        <span className="mono ch" aria-hidden="true" style={{ fontSize: 12, color: "rgba(241,238,232,.5)" }}>&gt;</span>
      </span>
      <span className="bd block" style={{ maxHeight: open ? 132 : undefined }}>
        <span className="block pb-4 pl-[18px] pr-4 pt-1">
          {lines.map((l, i) => (
            <span key={i} className="cl" style={{ ["--n" as string]: l.n, ["--d" as string]: `${i * 0.3}s` }}>{l.body}</span>
          ))}
        </span>
      </span>
    </button>
  );
}

export default function ExperienceScene() {
  const { language } = useLanguage();
  const { openBrief } = useBrief();
  const copy = experienceContent[language];
  const companies = content[language].experience.companies as { role: string; period: string }[];
  const biz = processContent[language].biz;
  const scale = useStageScale();
  const [bz, setBz] = useState(1); // business for the transfer line (index into /process businesses)
  const [hover, setHover] = useState(-1);
  const [pinned, setPinned] = useState(-1);
  const lifted = hover >= 0 ? hover : pinned;

  const comment = (text: string): Line => ({ n: text.length + 4, body: <span className="k3">// {text}</span> });
  const dossierLines = (i: number): Line[] => {
    const transfer = copy.transfer[i][bz];
    return [
      comment(copy.dossiers[i].domain),
      ...wrap(companies[i].role, 38).map(comment),
      comment(companies[i].period),
      { n: transfer.length + 4, body: <><span className="k1">→</span> <span className="k2">{transfer}</span></> },
    ];
  };

  return (
    <div className="sx relative h-[100svh] min-h-[560px] w-full overflow-hidden">
      <div className="absolute left-1/2 top-1/2" style={{ width: W, height: H, transform: `translate(-50%,-50%) scale(${scale})` }}>
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "radial-gradient(38% 46% at 61% 50%,#A855F744 0%,rgba(7,9,11,0) 72%),radial-gradient(30% 36% at 40% 86%,#EC489933 0%,rgba(7,9,11,0) 72%),radial-gradient(28% 34% at 90% 22%,#3B82F633 0%,rgba(7,9,11,0) 70%)" }} />
        <WarpBackground count={50} />
        <SiteHeader active="experience" />

        {/* The archive room */}
        <svg role="img" aria-label={copy.label} width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 z-[3] overflow-visible" style={{ transformOrigin: "830px 470px", transform: ROOM_TRANSFORM }} fill="none">
          <Static html={`<g style="animation:ghB 1.5s ease both;transform-origin:830px 470px">${GHOSTS}</g>`} />
          <g style={{ animation: "deckIn 1.1s cubic-bezier(.2,.8,.2,1) .2s both", transformOrigin: "830px 470px" }}>
            <g className="roomg">
              {layers.slice(0, 4).map((html, i) => <Static key={i} html={html} delay={ld(i)} />)}
              <g className="rlay" style={{ ["--ld" as string]: ld(4) }}>
                {FOLDERS.map((_, i) => (
                  <g key={i} className={`fold${lifted === i ? " up" : ""}`}>
                    <FolderArt i={i} />
                  </g>
                ))}
              </g>
              <Static html={layers[4]} delay={ld(5)} />
              <Static html={beam} />
            </g>
          </g>
        </svg>

        <svg aria-hidden="true" width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 z-[4] overflow-visible" fill="none">
          <Static html={LEADERS} />
        </svg>

        {/* const опыт = [3] — dossier cards */}
        <div className="cw pointer-events-none absolute inset-0 z-[7]">
          <div className="mono absolute z-[7]" style={{ left: CARD_X, top: 100, fontSize: 10.5, letterSpacing: ".14em", color: "rgba(241,238,232,.62)", animation: "v2in .7s ease .5s both" }}>
            <span className="k1">const</span> {copy.constName} <span className="k3">=</span> <span className="k2">[</span>
            <span className="gt">3</span>
            <span className="k2">]</span>
            <span className="k3"> // {copy.hint}</span>
          </div>
          {copy.dossiers.map((d, i) => (
            <DossierCard
              key={d.name}
              num={`0${i + 1}`}
              title={d.name}
              lines={dossierLines(i)}
              spot={SPOTS[i]}
              delay={0.55 + i * 0.1}
              onLift={(on) => setHover(on ? i : -1)}
              onClick={() => setPinned((p) => (p === i ? -1 : i))}
            />
          ))}
          <DossierCard
            num="+"
            title={copy.yours.name}
            dashed
            lines={[comment(copy.yours.line), { n: copy.yours.cta.length + 4, body: <><span className="k1">→</span> <span className="k2">{copy.yours.cta}</span></> }]}
            spot={SPOTS[3]}
            delay={0.85}
            onLift={() => {}}
            onClick={() => openBrief(`${copy.yours.name} · ${biz[bz].name}`, { biz: PROCESS_BIZ_IDS[bz] })}
          />
        </div>

        {/* Heading and "my experience for" business chips */}
        <div className="absolute z-[6] w-[560px]" style={{ left: 56, bottom: 56, animation: "v2in .8s ease .5s both" }}>
          <div className="flex items-center gap-3.5">
            <span className="mono gt uppercase" style={{ fontSize: 11, letterSpacing: ".14em" }}>{copy.eyebrow}</span>
            <span className="block h-px w-11" style={{ background: "var(--sx-grad)" }} />
            <span className="mono uppercase" style={{ fontSize: 11, letterSpacing: ".14em", color: "rgba(241,238,232,.62)" }}>{copy.tag}</span>
          </div>
          <h2 style={{ margin: "14px 0 0", fontSize: 46, lineHeight: 0.96, fontWeight: 500, letterSpacing: "-.06em" }}>
            <span className="block">{copy.title}</span>
            <span className="gt">{copy.accent}</span>
          </h2>
          <p style={{ margin: "16px 0 0", fontSize: 15.5, lineHeight: 1.5, color: "rgba(241,238,232,.78)" }}>{copy.lead}</p>
          <div className="mono uppercase" style={{ marginTop: 18, fontSize: 10, letterSpacing: ".16em", color: "rgba(241,238,232,.5)" }}>{copy.forBiz}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {biz.map((b, i) => (
              <button key={b.name} type="button" className="bcx" aria-pressed={bz === i} onClick={() => setBz(i)}>{b.name}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
