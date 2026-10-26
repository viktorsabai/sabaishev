import { useState } from "react";
import { PROCESS_BIZ_IDS, useBrief } from "@/brief/BriefContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { processContent, STAGE_DOCS, STAGE_WEEKS } from "@/process/content";
import { mobileContent } from "./content";
import MobileLayout from "./MobileLayout";

// Phone process: the desktop Gantt, then its layers as a vertical path. First the business
// question; then the Gantt (tap a row to jump to its layer) and the seven layers one under
// another, each with this business's pain, what I do, how, the document you get, and a look at it.

function fromQuery() {
  const n = Number(new URLSearchParams(window.location.search).get("biz"));
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : 0;
}

export default function MobileProcess() {
  const { language } = useLanguage();
  const { openBrief } = useBrief();
  const copy = processContent[language];
  const m = mobileContent[language];
  const [biz, setBiz] = useState(fromQuery);
  const B = copy.biz[(biz || 1) - 1];

  return (
    <MobileLayout active="process">
      <section className="mx-section mx-top">
        <div className="mx-eyebrow"><span className="mono gt">03</span><i /><span className="mono">{copy.eyebrow}</span></div>
        {!biz ? (
          <>
            <h1 className="mx-h1">{copy.title}<span className="gt">{copy.accent}</span></h1>
            <p className="mx-lead">{copy.lead}</p>
            <div className="mx-list">
              {copy.biz.map((b, i) => (
                <button key={b.name} type="button" className="mx-row" onClick={() => { setBiz(i + 1); window.scrollTo({ top: 0 }); }}>
                  <span className="mono gt">0{i + 1}</span>
                  <span className="flex-1">
                    <span className="block nm">{b.name}</span>
                    <span className="block hint">{b.hint}</span>
                    <span className="block pain">«{b.p[0][0]}»</span>
                  </span>
                  <span aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mx-chips" role="group" aria-label={m.changeBiz}>
              {copy.biz.map((b, i) => (
                <button key={b.name} type="button" aria-pressed={biz === i + 1} onClick={() => setBiz(i + 1)}>{b.name}</button>
              ))}
            </div>
            <div className="mx-gantt" aria-label={copy.eyebrow}>
              <div className="wk mono">{Array.from({ length: 10 }, (_, i) => <span key={i}>W{i + 1}</span>)}</div>
              {copy.stages.map((st, i) => {
                const w = STAGE_WEEKS[i];
                return (
                  <a key={st.name} href={`#layer-${i + 1}`} className="row" onClick={(e) => { e.preventDefault(); document.getElementById(`layer-${i + 1}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
                    <span className="nm">{st.name}</span>
                    <span className="track"><i style={{ left: `${w.s * 10}%`, width: `${w.d * 10}%`, animationDelay: `${0.2 + i * 0.08}s` }} /></span>
                  </a>
                );
              })}
            </div>
            <ol className="mx-path">
              {copy.stages.map((st, i) => {
                const w = STAGE_WEEKS[i];
                const doc = STAGE_DOCS[i].find((d) => d.img);
                return (
                  <li key={st.name} id={`layer-${i + 1}`} style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="node" aria-hidden="true" />
                    <div className="mono head">
                      <span className="gt">{copy.stage} 0{i + 1} / 07</span>
                      <span>W{w.s + 1}{w.d > 1 ? `–W${w.s + w.d}` : ""}</span>
                    </div>
                    <h3 className="gt">{st.name}</h3>
                    <div className="lbl mono">{copy.familiar}</div>
                    <p className="pain">«{B.p[i][0]}»</p>
                    <div className="lbl mono gt">{copy.whatIDo}</div>
                    <p>{B.p[i][1]}</p>
                    <div className="lbl mono">{copy.howTitle}</div>
                    <ul className="mx-how">{st.how.map((h) => <li key={h}><i aria-hidden="true" />{h}</li>)}</ul>
                    <div className="lbl mono">{copy.output}</div>
                    <div className="mx-code">
                      <div><span className="k1">const</span> {copy.code.out} <span className="k3">=</span> {"{"}</div>
                      <div className="in">{copy.code.doc}<span className="k3">:</span> <span className="k2">"{st.out.doc}"</span><span className="k3">,</span></div>
                      <div className="in">{copy.code.inside}<span className="k3">:</span> <span className="k2">[{st.out.inside.map((x) => `"${x}"`).join(", ")}]</span><span className="k3">,</span></div>
                      <div className="in">{copy.code.can}<span className="k3">:</span> <span className="k2">"{st.out.can}"</span></div>
                      <div>{"}"}</div>
                      {st.proof && <div className="k3 proof">// {copy.code.proof}: {st.proof}</div>}
                    </div>
                    {doc && (
                      <figure className="mx-doc">
                        <img src={doc.img} alt="" className={doc.light ? "light" : undefined} loading="lazy" decoding="async" />
                        <figcaption className="mono">{copy.docOfStage} · {doc.name}</figcaption>
                      </figure>
                    )}
                  </li>
                );
              })}
            </ol>
            <button type="button" className="mx-ghost wide" onClick={() => openBrief(`${B.name} · ${copy.eyebrow}`, { biz: PROCESS_BIZ_IDS[biz - 1] })}>{copy.discuss} →</button>
          </>
        )}
      </section>
    </MobileLayout>
  );
}
