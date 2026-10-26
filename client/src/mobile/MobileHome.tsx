import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useBrief } from "@/brief/BriefContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CASE_MEDIA } from "@/cases/content";
import { sceneV2Content } from "@/scene/v2/content";
import TypedText from "@/scene/v2/TypedText";
import { useTypewriter } from "@/scene/v2/typewriter";
import { DECK_DOTS, MobileRoom, MobileShip } from "./MobileArt";
import { mobileContent } from "./content";
import MobileLayout from "./MobileLayout";

// Phone home: the desktop scene told top to bottom. The same ship assembles in layers with its
// deck numbers; under it the eight decks as rooms — pick one (a deck on the ship, a chip, or a
// swipe) and its room builds, with the pain, what I do typed out, and the deliverables as code.

export default function MobileHome() {
  const { language } = useLanguage();
  const { openBrief } = useBrief();
  const v = sceneV2Content[language];
  const m = mobileContent[language];
  const typer = useTypewriter(v.slogans, false);
  const slogan = v.slogans[typer.idx];
  const typed = (slogan.lead + slogan.accent).slice(0, typer.len);
  const [stage, setStage] = useState(0);
  const [visit, setVisit] = useState(0); // re-keys the room so it assembles again
  const decks = useRef<HTMLElement>(null);
  const chips = useRef<HTMLDivElement>(null);
  const touch = useRef(0);
  const st = v.stages[stage];

  const show = (i: number, scroll = false) => {
    setStage((i + v.stages.length) % v.stages.length);
    setVisit((n) => n + 1);
    if (scroll) decks.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // Keep the chosen stage's chip in view.
  useEffect(() => {
    chips.current?.querySelector<HTMLElement>(`[data-i="${stage}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [stage]);

  return (
    <MobileLayout>
      <section className="mx-hero">
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
        </div>
        <div className="mx-shipwrap">
          <MobileShip label="SABAISHEV.ONLINE" />
          {DECK_DOTS.map((p, i) => (
            <button key={i} type="button" className="mx-deck mono" style={{ ...p, animationDelay: `${1.9 + i * 0.07}s` }} onClick={() => show(i, true)} aria-label={`${v.stageOf} ${v.stages[i].num} · ${v.stages[i].name}`}>
              {v.stages[i].num}
            </button>
          ))}
        </div>
        <div className="mx-stats">
          <span><b>17+</b> {m.years}</span>
          <i />
          <span><b>{CASE_MEDIA.filter((c) => !c.service).length}</b> {m.projects}</span>
          <i />
          <span className="flex items-center gap-2"><span className="pd" />{m.free}</span>
        </div>
      </section>

      <section ref={decks} className="mx-section mx-decks">
        <h2>{m.howTitle}</h2>
        <p className="mx-lead">{m.howLead}</p>
        <div ref={chips} className="mx-chips" role="tablist" aria-label={m.howTitle}>
          {v.stages.map((s, i) => (
            <button key={s.num} data-i={i} type="button" role="tab" aria-selected={stage === i} aria-pressed={stage === i} onClick={() => show(i)}>
              <span className="gt">{s.num}</span> {s.name}
            </button>
          ))}
        </div>
        <article
          className="mx-deckroom"
          role="tabpanel"
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 60) show(stage + (dx < 0 ? 1 : -1));
          }}
        >
          <MobileRoom key={`r${visit}`} stage={stage + 1} num={st.num} label={`${v.stageOf} ${st.num} · ${st.name}`} />
          <div key={`t${visit}`} className="mx-roomcopy">
            <div className="mono head"><span className="gt">{v.stageOf} {st.num} / 0{v.stages.length}</span><span>{st.tag}</span></div>
            <h3>{st.name}</h3>
            <div className="lbl mono">{m.pain}</div>
            <p className="pain">«{st.pain}»</p>
            <div className="lbl mono gt">{m.solution}</div>
            <p><TypedText text={st.solution} delay={1.1} cps={90} /></p>
            <div className="lbl mono">{m.youGet}</div>
            <div className="mx-code">
              {st.items.map((it) => (
                <div key={it.title} className="it">
                  <div className="t">{it.title}</div>
                  <div className="k3">// {it.why[0]} {it.why[1]}</div>
                  <div><span className="k1">return</span> <span className="k2">"{it.ret}"</span></div>
                </div>
              ))}
            </div>
            <div className="mx-roomnav">
              <button type="button" className="mx-ghost" onClick={() => openBrief(`${v.stageOf} ${st.num} · ${st.name}`)}>{m.discussStage} →</button>
              <span className="flex gap-2">
                <button type="button" className="rb2" aria-label="←" onClick={() => show(stage - 1)}>←</button>
                <button type="button" className="rb2" aria-label="→" onClick={() => show(stage + 1)}>→</button>
              </span>
            </div>
          </div>
        </article>
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
