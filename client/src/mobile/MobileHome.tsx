import { useState } from "react";
import { Link } from "wouter";
import { useBrief } from "@/brief/BriefContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CASE_MEDIA } from "@/cases/content";
import { sceneV2Content } from "@/scene/v2/content";
import { useTypewriter } from "@/scene/v2/typewriter";
import { mobileContent } from "./content";
import MobileLayout from "./MobileLayout";

// Phone home (reference/Mobile.dc.html): the product as three isometric layers, the typed
// slogan, quick facts; then the eight stages as an accordion, and the way into the rest.

function Layers() {
  return (
    <svg role="img" aria-label="Product layers" viewBox="60 80 440 480" className="mx-layers" fill="none">
      <defs>
        <linearGradient id="mgh" gradientUnits="userSpaceOnUse" x1="230" y1="0" x2="330" y2="0"><stop offset="0" stopColor="#EC4899" /><stop offset=".5" stopColor="#A855F7" /><stop offset="1" stopColor="#3B82F6" /></linearGradient>
        <linearGradient id="mgv" gradientUnits="userSpaceOnUse" x1="0" y1="220" x2="0" y2="430"><stop offset="0" stopColor="#EC4899" /><stop offset=".5" stopColor="#A855F7" /><stop offset="1" stopColor="#3B82F6" /></linearGradient>
      </defs>
      <g stroke="#F1EEE8" strokeOpacity=".55" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <path pathLength={1} className="mdr" style={{ animationDelay: ".2s" }} fill="rgba(7,9,11,.92)" d="M280 330L480 430L280 530L80 430Z" />
        <path pathLength={1} className="mdr" style={{ animationDelay: ".3s" }} strokeOpacity=".3" d="M80 430V444L280 544L480 444V430M280 530V544" />
        <path pathLength={1} className="mdr" style={{ animationDelay: ".8s" }} fill="rgba(7,9,11,.92)" d="M280 210L480 310L280 410L80 310Z" />
        <path pathLength={1} className="mdr" style={{ animationDelay: ".9s" }} strokeOpacity=".3" d="M80 310V324L280 424L480 324V310M280 410V424" />
        <path pathLength={1} className="mdr" style={{ animationDelay: "1.4s" }} fill="rgba(7,9,11,.92)" d="M280 90L480 190L280 290L80 190Z" />
        <path pathLength={1} className="mdr" style={{ animationDelay: "1.5s" }} strokeOpacity=".3" d="M80 190V204L280 304L480 204V190M280 290V304" />
      </g>
      <path pathLength={1} className="mdr" style={{ animationDelay: "1.8s" }} stroke="url(#mgh)" strokeWidth="2" strokeLinejoin="round" fill="rgba(168,85,247,.18)" d="M280 160L330 190L280 220L230 190Z" />
      <path stroke="url(#mgv)" strokeWidth="2" strokeDasharray="2 7" className="mx-dash" d="M280 220V430" />
      <circle cx="280" cy="310" r="4.5" fill="#A855F7" />
      <circle cx="280" cy="430" r="4.5" fill="#3B82F6" />
    </svg>
  );
}

export default function MobileHome() {
  const { language } = useLanguage();
  const { openBrief } = useBrief();
  const v = sceneV2Content[language];
  const m = mobileContent[language];
  const typer = useTypewriter(v.slogans, false);
  const slogan = v.slogans[typer.idx];
  const typed = (slogan.lead + slogan.accent).slice(0, typer.len);
  const [openStage, setOpenStage] = useState(-1);

  return (
    <MobileLayout>
      <section className="mx-hero">
        <Layers />
        <div className="mx-hero-copy">
          <div className="mx-eyebrow"><span className="mono gt">0{typer.idx + 1}</span><i /><span key={typer.idx} className="mono">{slogan.eyebrow}</span></div>
          <h1 aria-label={slogan.lead + slogan.accent}>
            <span aria-hidden="true">
              {typed.slice(0, slogan.lead.length)}
              <span className="gt">{typed.slice(slogan.lead.length)}</span>
              <span className="tcaret" />
            </span>
          </h1>
          <p className="mx-sub" style={{ opacity: typer.done ? 1 : 0 }}>{slogan.subtitle}</p>
          <div className="mx-stats">
            <span><b>17+</b> {m.years}</span>
            <i />
            <span><b>{CASE_MEDIA.length}</b> {m.projects}</span>
            <i />
            <span className="flex items-center gap-2"><span className="pd" />{m.free}</span>
          </div>
        </div>
      </section>

      <section className="mx-section">
        <h2>{m.howTitle}</h2>
        <p className="mx-lead">{m.howLead}</p>
        <ol className="mx-acc">
          {v.stages.map((s, i) => {
            const open = openStage === i;
            return (
              <li key={s.num} className={open ? "open" : undefined}>
                <button type="button" aria-expanded={open} onClick={() => setOpenStage(open ? -1 : i)}>
                  <span className="mono gt">{s.num}</span>
                  <span className="flex-1">
                    <span className="block nm">{s.name}</span>
                    <span className="block mono tg">{s.tag}</span>
                  </span>
                  <span className="chev" aria-hidden="true">›</span>
                </button>
                {open && (
                  <div className="mx-acc-body">
                    <div className="lbl mono">{m.pain}</div>
                    <p className="pain">«{s.pain}»</p>
                    <div className="lbl mono gt">{m.solution}</div>
                    <p>{s.solution}</p>
                    <div className="lbl mono">{m.youGet}</div>
                    <div className="mx-code">
                      {s.items.map((it) => (
                        <div key={it.title} className="it">
                          <div className="t">{it.title}</div>
                          <div className="k3">// {it.why[0]} {it.why[1]}</div>
                          <div><span className="k1">return</span> <span className="k2">"{it.ret}"</span></div>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="mx-ghost" onClick={() => openBrief(`${v.stageOf} ${s.num} · ${s.name}`)}>{m.discussStage} →</button>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mx-section mx-more">
        {([["/cases", m.more.cases], ["/process", m.more.process], ["/experience", m.more.experience]] as const).map(([href, label], i) => (
          <Link key={href} href={href} className="mx-link">
            <span className="mono gt">0{i + 2}</span>
            <span className="flex-1">{label}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </section>
    </MobileLayout>
  );
}
