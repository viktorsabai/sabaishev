import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { sceneContent } from "./sceneContent";
import "./transition.css";

// One transition for every page, so the site reads as one scene: on an internal link the page
// is covered top-down by the ship's blueprint (the next page's code loads meanwhile), then the
// new page assembles under a scan line that sweeps down and uncovers it.

const OUT_MS = 340;
const SECTION: Record<string, "services" | "cases" | "process" | "experience"> = { "/": "services", "/cases": "cases", "/process": "process", "/experience": "experience" };
const NUMBER: Record<string, string> = { "/": "01", "/cases": "02", "/process": "03", "/experience": "04" };

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PageTransition({ preload }: { preload: (path: string) => Promise<unknown> | undefined }) {
  const [location, navigate] = useLocation();
  const { language } = useLanguage();
  // phase: what the veil is doing; run: re-keys it so its animation restarts.
  const [phase, setPhase] = useState<"idle" | "out" | "in">(() => (window.location.pathname !== "/" && !reduced() ? "in" : "idle"));
  const [run, setRun] = useState(0);
  const [label, setLabel] = useState(window.location.pathname);
  const prev = useRef(location);
  const leaving = useRef(false);

  // Internal links anywhere on the site leave through the veil.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || reduced()) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target || a.origin !== window.location.origin) return;
      if (!(a.pathname in SECTION) || a.pathname === window.location.pathname) return;
      e.preventDefault();
      if (leaving.current) return;
      leaving.current = true;
      const to = a.pathname + a.search;
      setLabel(a.pathname);
      setPhase("out");
      setRun((r) => r + 1);
      Promise.all([preload(a.pathname), new Promise((r) => window.setTimeout(r, OUT_MS))]).finally(() => {
        leaving.current = false;
        navigate(to);
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate, preload]);

  // A new page: the veil sweeps off it.
  useEffect(() => {
    if (prev.current === location) return;
    prev.current = location;
    window.scrollTo(0, 0);
    if (reduced()) return setPhase("idle");
    setLabel(location);
    setPhase("in");
    setRun((r) => r + 1);
  }, [location]);

  if (phase === "idle") return null;
  const key = SECTION[label];
  const name = key ? sceneContent[language].nav[key] : "";
  return (
    <div key={run} className={`pt pt-${phase}`} aria-hidden="true" onAnimationEnd={(e) => { if (phase === "in" && e.target === e.currentTarget) setPhase("idle"); }}>
      <div className="pt-veil" />
      <div className="pt-scan">
        <span className="mono"><b className="gt">{NUMBER[label] ?? ""}</b> // {name}</span>
      </div>
    </div>
  );
}
