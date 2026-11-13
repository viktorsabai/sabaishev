import { useLocation } from "wouter";
import { useBrief } from "@/brief/BriefContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CASE_MEDIA, casesContent, EXAMPLES } from "@/cases/content";
import ProtoViewer from "@/cases/ProtoViewer";
import SiteBuild from "@/cases/SiteBuild";
import { mobileContent } from "./content";
import MobileLayout from "./MobileLayout";

// Phone cases: the three projects one under another, each with its live phone screenshot
// scrolling inside a phone frame, task / role / result and a link to the project; then the
// site-development slot, where a site assembles in the frame and the button opens the brief.

export default function MobileCases() {
  const { language } = useLanguage();
  const copy = casesContent[language];
  const m = mobileContent[language];
  const { openBrief } = useBrief();
  const [location, navigate] = useLocation();
  const proto = EXAMPLES.find((p) => location === `/cases/${p.id}`);
  return (
    <MobileLayout active="cases">
      <section className="mx-section mx-top">
        <div className="mx-eyebrow"><span className="mono gt">02</span><i /><span className="mono">{copy.eyebrow}</span></div>
        <div className="mx-cases">
          {CASE_MEDIA.map((c, i) => {
            const text = copy.cases[i];
            return (
              <article key={c.slug} className="mx-case" style={{ ["--hue" as string]: c.hue }}>
                <div className="phone">
                  <i className="notch" aria-hidden="true" />
                  {c.service && <div className="cs on"><SiteBuild mock={copy.mock} phone /></div>}
                  {c.locked && (
                    <div className="mx-lock">
                      <span className="ic"><svg width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><rect x="2" y="9" width="14" height="10" rx="2.5" /><path d="M5 9V6a4 4 0 018 0v3" /></svg></span>
                      <b>{copy.locked.title}</b>
                      <span className="mono">{copy.locked.note}</span>
                    </div>
                  )}
                  {c.mobile && (
                    <div className={`shot${c.still ? " still" : ""}${c.frames ? ` f${c.frames}` : ""}${c.locked ? " dim" : ""}`}>
                      <img src={c.mobile} alt={`${copy.screenshot} ${text.name}`} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
                    </div>
                  )}
                </div>
                <div className="mono meta"><span className="gt">0{i + 1}</span> {text.type}</div>
                <h2>{text.name}</h2>
                <p>{text.desc}</p>
                <div className="spec">
                  {copy.specKeys.map((key, j) => <div key={key}><b>{key}</b><span>{text.spec[j]}</span></div>)}
                </div>
                <ul className="tags">{text.tags.map((t) => <li key={t} className="mono">{t}</li>)}</ul>
                <div className="flex items-center gap-4">
                  {c.service ? (
                    <button type="button" className="mx-open" onClick={() => openBrief(text.type, { need: ["site"] })}>{copy.discuss} →</button>
                  ) : c.locked ? (
                    <button type="button" className="mx-open" onClick={() => openBrief(`${copy.locked.context} · ${text.name}`)}>{copy.locked.request} →</button>
                  ) : (
                    <a className="mx-open" href={c.url} target="_blank" rel="noopener noreferrer">{m.open} ↗</a>
                  )}
                  <span className="mono status">{text.status}</span>
                </div>
                {c.service && EXAMPLES.map((p) => (
                  <button key={p.id} type="button" className="mx-proto mono" onClick={() => navigate(`/cases/${p.id}`)}><i aria-hidden="true" />{copy.proto.example}: {p.name} — {copy.proto.kind}</button>
                ))}
              </article>
            );
          })}
        </div>
      </section>
      {proto && <ProtoViewer proto={proto} copy={copy.proto} onClose={() => navigate("/cases", { replace: true })} />}
    </MobileLayout>
  );
}
