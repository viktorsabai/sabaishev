import { memo, useState } from "react";
import { PROCESS_BIZ_IDS, useBrief } from "@/brief/BriefContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { experienceContent } from "@/experience/content";
import { content } from "@/lib/content";
import { EMPTY, FLOW, FOLDERS, OBJECTS, PEOPLE, SHELL, WALL } from "@/experience/markup";
import { processContent } from "@/process/content";
import { roomLayers } from "@/scene/v2/roomLayers";
import "@/experience/experience.css";
import { mobileContent } from "./content";
import MobileLayout from "./MobileLayout";

// Phone experience: the desktop's archive room assembling, then the dossiers as cards (domain,
// role, years) whose last line says what that experience gives the business picked in the
// chips, and an open "your product" dossier. Tapping a dossier lifts its folder in the room.

const { layers } = roomLayers([SHELL, OBJECTS, EMPTY, FLOW, PEOPLE].join("\n"), WALL);
const Static = memo(function Static({ html, delay }: { html: string; delay: number }) {
  return <g className="rlay" style={{ ["--ld" as string]: `${delay.toFixed(2)}s` }} dangerouslySetInnerHTML={{ __html: html }} />;
});
const Folder = memo(function Folder({ i }: { i: number }) {
  return <g dangerouslySetInnerHTML={{ __html: FOLDERS[i].replace(/ style="animation-delay:[^;"]*;animation-duration:[^;"]*;/g, ' style="') }} />;
});
function Archive({ label, lifted }: { label: string; lifted: number }) {
  return (
    <svg role="img" aria-label={label} viewBox="610 215 520 470" className="mx-room" fill="none">
      <g className="roomg">
        {layers.slice(0, 4).map((html, i) => <Static key={i} html={html} delay={0.1 + i * 0.26} />)}
        <g className="rlay" style={{ ["--ld" as string]: "1.15s" }}>
          {FOLDERS.map((_, i) => <g key={i} className={`fold${lifted === i ? " up" : ""}`}><Folder i={i} /></g>)}
        </g>
        <Static html={layers[4]} delay={1.4} />
      </g>
    </svg>
  );
}

export default function MobileExperience() {
  const { language } = useLanguage();
  const { openBrief } = useBrief();
  const copy = experienceContent[language];
  const m = mobileContent[language];
  const companies = content[language].experience.companies as { role: string; period: string }[];
  const biz = processContent[language].biz;
  const [bz, setBz] = useState(1);
  const [lifted, setLifted] = useState(-1);

  return (
    <MobileLayout active="experience">
      <section className="mx-section mx-top">
        <Archive label={copy.label} lifted={lifted} />
        <div className="mx-eyebrow"><span className="mono gt">{copy.eyebrow}</span><i /><span className="mono">{copy.tag}</span></div>
        <h1 className="mx-h1">{copy.title}<br /><span className="gt">{copy.accent}</span></h1>
        <p className="mx-lead">{copy.lead}</p>
        <div className="lbl mono" style={{ marginTop: 18 }}>{m.dossierFor}</div>
        <div className="mx-chips">
          {biz.map((b, i) => <button key={b.name} type="button" aria-pressed={bz === i} onClick={() => setBz(i)}>{b.name}</button>)}
        </div>
        <div className="mx-dossiers">
          {copy.dossiers.map((d, i) => (
            <article key={d.name} className={`mx-dossier${lifted === i ? " on" : ""}`} onClick={() => setLifted((l) => (l === i ? -1 : i))}>
              <div className="mono head"><span className="gt">0{i + 1}</span> {companies[i].period}</div>
              <h3>{d.name}</h3>
              <div className="mx-code">
                <div className="k3">// {d.domain}</div>
                <div className="k3">// {companies[i].role}</div>
                <div key={bz} className="flash"><span className="k1">→</span> <span className="k2">{copy.transfer[i][bz]}</span></div>
              </div>
            </article>
          ))}
          <button type="button" className="mx-dossier empty" onClick={() => openBrief(`${copy.yours.name} · ${biz[bz].name}`, { biz: PROCESS_BIZ_IDS[bz] })}>
            <div className="mono head">+</div>
            <h3>{copy.yours.name}</h3>
            <div className="mx-code"><div className="k3">// {copy.yours.line}</div><div><span className="k1">→</span> <span className="k2">{copy.yours.cta}</span></div></div>
          </button>
        </div>
      </section>
    </MobileLayout>
  );
}
