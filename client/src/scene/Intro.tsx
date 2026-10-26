import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { sceneContent } from "./sceneContent";
import "./intro.css";

// Intro (reference/Intro.dc.html), shortened to ~1.2 s: the wordmark sharpens out of a blur,
// .ONLINE and the slogan follow, a thin gradient bar fills to 100%, then it fades into the
// scene. Shown once per browser (remembered in localStorage) and skipped for reduced motion.

const KEY = "sx-intro-seen";
const SHOW_MS = 1050; // fade starts; the page underneath mounts at this point
const FADE_MS = 300;

export function shouldShowIntro() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try { return !window.localStorage.getItem(KEY); } catch { return false; }
}

export default function Intro({ onReveal }: { onReveal: () => void }) {
  const { language } = useLanguage();
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"on" | "fading" | "gone">("on");

  useEffect(() => {
    try { window.localStorage.setItem(KEY, "1"); } catch { /* private mode: show again next time */ }
    const t0 = performance.now();
    let raf = requestAnimationFrame(function tick(t) {
      const k = Math.min(1, (t - t0) / (SHOW_MS - 100));
      setPct(Math.round(100 * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    });
    const a = window.setTimeout(() => { setPhase("fading"); onReveal(); }, SHOW_MS);
    const b = window.setTimeout(() => setPhase("gone"), SHOW_MS + FADE_MS);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(a); window.clearTimeout(b); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "gone") return null;
  return (
    <div className={`sx-intro${phase === "fading" ? " out" : ""}`} aria-hidden="true">
      <div className="glow" />
      <div className="grid" />
      <div className="corner mono l">SABAISHEV.ONLINE</div>
      <div className="corner mono r">{new Date().getFullYear()}</div>
      <div className="mid">
        <div className="wm">SABAISHEV</div>
        <div className="mono dot gt">.ONLINE</div>
        <div className="tg">{sceneContent[language].hero.title.join(" ")} {sceneContent[language].hero.accent}</div>
      </div>
      <div className="foot">
        <div className="bar"><i style={{ width: `${pct}%` }} /></div>
        <div className="pct"><span className="gt">{pct}</span><small>%</small></div>
      </div>
    </div>
  );
}
