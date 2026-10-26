import { useEffect, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { useBrief } from "@/brief/BriefContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/content";
import { sceneContent } from "@/scene/sceneContent";
import { mobileContent } from "./content";
import { ArtDefs, MobileWarp } from "./MobileArt";
import "@/scene/scene.css";
import "./mobile.css";

// Phone layout shell: the desktop's flight background behind every page, a compact header
// (brand, language, menu), a full-screen menu sheet, and a request button pinned to the bottom.

type Section = "services" | "cases" | "process" | "experience";
const LANGS: Language[] = ["ru", "en", "th"];

export default function MobileLayout({ active, children }: { active?: Section; children: ReactNode }) {
  const { language, setLanguage } = useLanguage();
  const { openBrief } = useBrief();
  const t = sceneContent[language];
  const m = mobileContent[language];
  const [menu, setMenu] = useState(false);

  // Same tab title / description / lang handling as the desktop header.
  useEffect(() => {
    const section = active && active !== "services" ? t.nav[active] : "";
    document.title = section ? `${section} — ${t.seo.title.split(" — ")[0]}` : t.seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.seo.description);
    document.documentElement.lang = language;
  }, [active, language, t]);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  const nextLang = LANGS[(LANGS.indexOf(language) + 1) % LANGS.length];
  const links: [Section, string][] = [["services", "/"], ["cases", "/cases"], ["process", "/process"], ["experience", "/experience"]];

  return (
    <div className="sx mx">
      <ArtDefs />
      <MobileWarp />
      <div className="mx-glow" aria-hidden="true" />
      <header className="mx-head">
        <Link href="/" className="flex items-baseline gap-1" aria-label="SABAISHEV.ONLINE">
          <span style={{ fontWeight: 300, fontSize: 16, letterSpacing: ".34em" }}>SABAISHEV</span>
          <span className="mono gt" style={{ fontSize: 9, letterSpacing: ".1em" }}>.ONLINE</span>
        </Link>
        <div className="flex items-center gap-1">
          <button type="button" className="mx-lang mono" onClick={() => setLanguage(nextLang)} aria-label={`Language: ${nextLang.toUpperCase()}`}>{language.toUpperCase()}</button>
          <button type="button" className="mx-burger" aria-label={m.menu} aria-expanded={menu} onClick={() => setMenu(true)}>
            <i /><i />
          </button>
        </div>
      </header>

      {menu && (
        <div className="mx-menu" role="dialog" aria-modal="true" aria-label={m.menu}>
          <div className="mx-head">
            <span style={{ fontWeight: 300, fontSize: 16, letterSpacing: ".34em" }}>SABAISHEV</span>
            <button type="button" className="mx-burger open" aria-label={m.close} onClick={() => setMenu(false)}><i /><i /></button>
          </div>
          <nav className="mx-nav">
            {links.map(([key, href], i) => (
              <Link key={key} href={href} onClick={() => setMenu(false)} className={active === key ? "on" : undefined} style={{ animationDelay: `${0.05 + i * 0.05}s` }}>
                <span className="mono gt">0{i + 1}</span>{t.nav[key]}
              </Link>
            ))}
          </nav>
          <div className="mx-langs">
            {LANGS.map((l) => (
              <button key={l} type="button" className="mono" aria-pressed={language === l} onClick={() => setLanguage(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      )}

      <main className="mx-main">{children}</main>

      <div className="mx-cta">
        <button type="button" onClick={() => openBrief()}>
          {m.brief}
          <span aria-hidden="true">
            <svg width="18" height="10" viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6h19M15 1l5 5-5 5" /></svg>
          </span>
        </button>
      </div>
    </div>
  );
}
