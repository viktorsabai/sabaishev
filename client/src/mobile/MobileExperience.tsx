import { useState } from "react";
import { PROCESS_BIZ_IDS, useBrief } from "@/brief/BriefContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { experienceContent } from "@/experience/content";
import { content } from "@/lib/content";
import { processContent } from "@/process/content";
import { mobileContent } from "./content";
import MobileLayout from "./MobileLayout";

// Phone experience: the dossiers as cards (domain, role, years) whose last line says what that
// experience gives the business picked in the chips, and an open "your product" dossier.

export default function MobileExperience() {
  const { language } = useLanguage();
  const { openBrief } = useBrief();
  const copy = experienceContent[language];
  const m = mobileContent[language];
  const companies = content[language].experience.companies as { role: string; period: string }[];
  const biz = processContent[language].biz;
  const [bz, setBz] = useState(1);

  return (
    <MobileLayout active="experience">
      <section className="mx-section mx-top">
        <div className="mx-eyebrow"><span className="mono gt">{copy.eyebrow}</span><i /><span className="mono">{copy.tag}</span></div>
        <h1 className="mx-h1">{copy.title}<br /><span className="gt">{copy.accent}</span></h1>
        <p className="mx-lead">{copy.lead}</p>
        <div className="lbl mono" style={{ marginTop: 18 }}>{m.dossierFor}</div>
        <div className="mx-chips">
          {biz.map((b, i) => <button key={b.name} type="button" aria-pressed={bz === i} onClick={() => setBz(i)}>{b.name}</button>)}
        </div>
        <div className="mx-dossiers">
          {copy.dossiers.map((d, i) => (
            <article key={d.name} className="mx-dossier">
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
