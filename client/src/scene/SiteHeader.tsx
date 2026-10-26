import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/content";
import { sceneContent, TELEGRAM_URL } from "./sceneContent";

type Section = "services" | "cases" | "process" | "experience";

// Site header shared by the scene pages. On the main scene, Services and the brand act on the
// ship (onServices / onBrand); elsewhere they navigate to it.
export default function SiteHeader({ active, onServices, onBrand }: { active?: Section; onServices?: () => void; onBrand?: () => void }) {
  const { language, setLanguage } = useLanguage();
  const t = sceneContent[language];
  const activeStyle = (s: Section): React.CSSProperties | undefined =>
    active === s ? { opacity: 1, borderBottom: "1px solid var(--sx-accent-ink)" } : undefined;
  return (
    <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-14 py-[26px]">
      {onBrand ? (
        <a href="#top" onClick={onBrand} className="flex items-baseline gap-1.5" aria-label="SABAISHEV.ONLINE">
          <Brand />
        </a>
      ) : (
        <Link href="/" className="flex items-baseline gap-1.5" aria-label="SABAISHEV.ONLINE">
          <Brand />
        </Link>
      )}
      <nav className="flex items-center gap-[38px]">
        {onServices ? (
          <button type="button" className="nv" style={activeStyle("services")} onClick={onServices}>{t.nav.services}</button>
        ) : (
          <Link href="/?stage=1" className="nv" style={activeStyle("services")}>{t.nav.services}</Link>
        )}
        <Link href="/legacy" className="nv" style={activeStyle("cases")}>{t.nav.cases}</Link>
        <Link href="/process" className="nv" style={activeStyle("process")}>{t.nav.process}</Link>
        <Link href="/legacy" className="nv" style={activeStyle("experience")}>{t.nav.experience}</Link>
      </nav>
      <div className="flex items-center gap-[22px]">
        <div className="flex" role="group" aria-label="Language">
          {(["ru", "en", "th"] as Language[]).map((l) => (
            <button key={l} type="button" className="lg" aria-pressed={language === l} onClick={() => setLanguage(l)} style={language === l ? { background: "rgba(255,255,255,.12)" } : { opacity: 0.55 }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="pill" style={{ padding: "13px 22px", font: "600 12px var(--font-tight)", letterSpacing: ".02em" }}>
          {t.cta.project}
        </a>
      </div>
    </header>
  );
}

function Brand() {
  return (
    <>
      <span style={{ fontWeight: 300, fontSize: 21, letterSpacing: ".42em" }}>SABAISHEV</span>
      <span className="mono gt" style={{ fontSize: 11, letterSpacing: ".14em" }}>.ONLINE</span>
    </>
  );
}
