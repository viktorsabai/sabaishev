import { useLanguage } from "@/contexts/LanguageContext";
import { CASE_MEDIA, casesContent } from "@/cases/content";
import { mobileContent } from "./content";
import MobileLayout from "./MobileLayout";

// Phone cases: the four projects one under another, each with its live phone screenshot
// scrolling inside a phone frame, the description and a link to the project.

export default function MobileCases() {
  const { language } = useLanguage();
  const copy = casesContent[language];
  const m = mobileContent[language];
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
                  {c.mobile && (
                    <div className={`shot${c.still ? " still" : ""}`}>
                      <img src={c.mobile} alt={`${copy.screenshot} ${text.name}`} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
                    </div>
                  )}
                </div>
                <div className="mono meta"><span className="gt">0{i + 1}</span> {text.type}</div>
                <h2>{text.name}</h2>
                <p>{text.desc}</p>
                <ul className="tags">{text.tags.map((t) => <li key={t} className="mono">{t}</li>)}</ul>
                <div className="flex items-center gap-4">
                  <a className="mx-open" href={c.url} target="_blank" rel="noopener noreferrer">{m.open} ↗</a>
                  <span className="mono status">{text.status}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </MobileLayout>
  );
}
