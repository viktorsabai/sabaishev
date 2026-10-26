import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackConversion } from "@/lib/analytics";
import { content, type Language } from "@/lib/content";
import { briefContent } from "./content";
import "./brief.css";

// The quick brief, opened from any "Discuss…" button as a ship comms console over the blurred
// page. Same questions and the same delivery as the site's existing brief (components/Contact):
// the summary is sent as a prefilled Telegram message, an email, or Instagram.

type BriefApi = { openBrief: (context?: string) => void };
const BriefCtx = createContext<BriefApi>({ openBrief: () => {} });
export const useBrief = () => useContext(BriefCtx);

type Opt = { id: string; label: string };
type Currency = "RUB" | "THB" | "USD";
const BUDGET: Record<Currency, { min: number; max: number; step: number }> = {
  RUB: { min: 100_000, max: 5_000_000, step: 50_000 },
  THB: { min: 30_000, max: 1_500_000, step: 10_000 },
  USD: { min: 1_000, max: 50_000, step: 500 },
};
const LOCALE: Record<Language, string> = { ru: "ru-RU", en: "en-US", th: "th-TH" };
const CURRENCY: Record<Language, Currency> = { ru: "RUB", en: "USD", th: "THB" };
function money(value: number, currency: Currency, language: Language) {
  const n = new Intl.NumberFormat(LOCALE[language], { maximumFractionDigits: 0 }).format(value);
  return currency === "RUB" ? `${n} ₽` : currency === "THB" ? `฿${n}` : `$${n}`;
}
const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

export function BriefProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; context?: string; key: number }>({ open: false, key: 0 });
  const openBrief = useCallback((context?: string) => {
    trackConversion("brief_start", context ? { context } : undefined);
    setState((s) => ({ open: true, context, key: s.key + 1 }));
  }, []);
  const api = useMemo(() => ({ openBrief }), [openBrief]);
  return (
    <BriefCtx.Provider value={api}>
      {children}
      {state.open && <BriefConsole key={state.key} context={state.context} onClose={() => setState((s) => ({ ...s, open: false }))} />}
    </BriefCtx.Provider>
  );
}

function BriefConsole({ context, onClose }: { context?: string; onClose: () => void }) {
  const { language } = useLanguage();
  const form = content[language].contact.form;
  const links = content[language].contact.links;
  const t = briefContent[language];
  const opts = (k: string) => form.options[k] as Opt[];
  const [step, setStep] = useState(0);
  const [need, setNeed] = useState<string[]>([]);
  const [domain, setDomain] = useState<string[]>([]);
  const [timeline, setTimeline] = useState("");
  const [location, setLocation] = useState("");
  const [currency, setCurrency] = useState<Currency>(CURRENCY[language]);
  const [budget, setBudget] = useState(BUDGET[CURRENCY[language]].min * 5);
  const [channel, setChannel] = useState("telegram");
  const [sent, setSent] = useState(false);
  const [closing, setClosing] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const winRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return onClose();
    setClosing(true);
    window.setTimeout(onClose, 280);
  };

  // Focus into the console, restore it on close; Esc closes; Tab stays inside.
  useEffect(() => {
    returnFocus.current = document.activeElement as HTMLElement;
    const id = window.setTimeout(() => winRef.current?.querySelector<HTMLElement>("button, a")?.focus(), 400);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !winRef.current) return;
      const items = Array.from(winRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), a, input"));
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    const tick = window.setInterval(() => setClock(new Date()), 1000);
    return () => { window.clearTimeout(id); window.clearInterval(tick); window.removeEventListener("keydown", onKey); returnFocus.current?.focus?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const label = (k: string, id: string) => opts(k).find((o) => o.id === id)?.label;
  const summary = [
    context ? `${t.context}: ${context}` : "",
    `${form.summary.need}: ${need.map((id) => label("need", id)).join(", ") || "—"}`,
    `${form.summary.domain}: ${domain.map((id) => label("domain", id)).join(", ") || "—"}`,
    `${form.summary.timeline}: ${label("timeline", timeline) || "—"}`,
    `${form.summary.budget}: ${money(budget, currency, language)}`,
    `${form.summary.location}: ${label("location", location) || "—"}`,
    `${form.summary.channel}: ${label("channel", channel) || "—"}`,
  ].filter(Boolean).join("\n");

  const can = [need.length > 0, Boolean(timeline), Boolean(channel)];
  const send = () => {
    trackConversion("brief_submit", { need, domain, budget, currency, channel, context });
    const body = encodeURIComponent(`${form.submitMessage}\n\n${summary}`);
    if (channel === "telegram") window.open(`https://t.me/bayshev?text=${body}`, "_blank", "noopener,noreferrer");
    else if (channel === "email") window.location.href = `mailto:sabaishev@icloud.com?subject=${encodeURIComponent(form.submitSubject)}&body=${body}`;
    else window.open(links.instagram, "_blank", "noopener,noreferrer");
    setSent(true);
  };
  const setCur = (c: Currency) => {
    const from = BUDGET[currency], to = BUDGET[c];
    const ratio = (budget - from.min) / (from.max - from.min);
    const v = Math.round((to.min + ratio * (to.max - to.min)) / to.step) * to.step;
    setCurrency(c);
    setBudget(Math.min(to.max, Math.max(to.min, v)));
  };

  // Radar blips: one per answer, placed around the scope.
  const answers = need.length + domain.length + (timeline ? 1 : 0) + (location ? 1 : 0) + (channel ? 1 : 0);
  const blips = Array.from({ length: Math.min(answers, 9) }, (_, i) => {
    const a = i * 2.4 + 0.6, r = 22 + ((i * 17) % 52);
    return { left: 84 + Math.cos(a) * r, top: 84 + Math.sin(a) * r };
  });
  const utc = clock.toISOString().slice(11, 19);

  const Chip = ({ k, id, on, onClick, sm }: { k: string; id: string; on: boolean; onClick: () => void; sm?: boolean }) => (
    <button type="button" className={`bf-chip${sm ? " sm" : ""}`} aria-pressed={on} onClick={onClick}>
      <span className="bx" aria-hidden="true" />
      {label(k, id)}
    </button>
  );

  return (
    <div className={`bf-overlay${closing ? " closing" : ""}`} onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div ref={winRef} className="bf-win" role="dialog" aria-modal="true" aria-labelledby="bf-title">
        <i className="bf-corner tl" /><i className="bf-corner tr" /><i className="bf-corner bl" /><i className="bf-corner br" />
        <div className="bf-band" aria-hidden="true" />

        {/* Schematic rail: radar, sequence, telemetry */}
        <aside className="bf-rail bf-in" aria-hidden="true">
          <div className="bf-mono bf-dim" style={{ fontSize: 9.5 }}>{t.console}</div>
          <div className="bf-radar">
            {[36, 62, 84].map((s) => <i key={s} className="ring" style={{ left: 84 - s, top: 84 - s, width: s * 2, height: s * 2 }} />)}
            <i className="cross" style={{ left: 0, right: 0, top: 83.5, height: 1 }} />
            <i className="cross" style={{ top: 0, bottom: 0, left: 83.5, width: 1 }} />
            <div className="bf-sweep" />
            {blips.map((b, i) => <span key={i} className="bf-blip" style={{ left: b.left, top: b.top, animationDelay: `${i * 0.2}s` }} />)}
          </div>
          <div className="bf-seq">
            <div className="bf-mono bf-dim" style={{ fontSize: 9 }}>{t.seq}</div>
            {t.steps.map((s, i) => (
              <div key={s} className={`bf-node bf-mono${i < step || sent ? " done" : ""}${i === step && !sent ? " on" : ""}`}>
                <b>{i < step || sent ? "✓" : `0${i + 1}`}</b>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div className="bf-tele bf-mono bf-dim">
            <div><span>{t.signal}</span><span className="bf-bars">{[0, 1, 2, 3].map((i) => <i key={i} style={{ animationDelay: `${i * 0.15}s` }} />)}</span></div>
            <div><span>LAT</span><span>07.89 N</span></div>
            <div><span>LON</span><span>98.39 E</span></div>
            <div><span>UTC</span><span>{utc}</span></div>
            <div><span>{t.payload}</span><span>{(summary.length / 1024).toFixed(2)} KB</span></div>
          </div>
        </aside>

        <div className="bf-main">
          <div className="bf-top bf-mono bf-in">
            <span className="flex items-center gap-2.5"><i className="bf-rec" /> SABAISHEV.ONLINE // {t.channel} 07 · {t.secure}</span>
            <button type="button" className="bf-x" onClick={close} aria-label={t.close}>
              <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" /></svg>
            </button>
          </div>

          <div className="bf-body bf-in" key={sent ? "sent" : step}>
            {sent ? (
              <>
                <div className="bf-dish" aria-hidden="true"><i /><i /><i /></div>
                <h2 id="bf-title" className="bf-title"><span className="gt">{t.sentTitle}</span></h2>
                <p className="bf-hint">{t.sentText}</p>
                <div className="bf-summary">{summary}</div>
              </>
            ) : (
              <>
                <div className="bf-mono" style={{ fontSize: 10.5 }}>
                  <span className="gt">{t.step} 0{step + 1} {t.of} 03</span>
                  <span className="bf-dim"> · {t.steps[step]}</span>
                </div>
                <h2 id="bf-title" className="bf-title">{t.titles[step]}</h2>
                <p className="bf-hint">{t.hints[step]}</p>
                {step === 0 && (
                  <>
                    <div className="bf-group">
                      <div className="bf-label bf-mono">{form.steps.need}</div>
                      <div className="bf-chips">{opts("need").map((o) => <Chip key={o.id} k="need" id={o.id} on={need.includes(o.id)} onClick={() => setNeed((l) => toggle(l, o.id))} />)}</div>
                    </div>
                    <div className="bf-group">
                      <div className="bf-label bf-mono">{form.steps.domain} · {t.optional}</div>
                      <div className="bf-chips">{opts("domain").map((o) => <Chip key={o.id} k="domain" id={o.id} sm on={domain.includes(o.id)} onClick={() => setDomain((l) => toggle(l, o.id))} />)}</div>
                    </div>
                  </>
                )}
                {step === 1 && (
                  <>
                    <div className="bf-group">
                      <div className="bf-label bf-mono">{form.steps.timeline}</div>
                      <div className="bf-chips">{opts("timeline").map((o) => <Chip key={o.id} k="timeline" id={o.id} on={timeline === o.id} onClick={() => setTimeline(o.id)} />)}</div>
                    </div>
                    <div className="bf-group">
                      <div className="bf-label bf-mono">{form.steps.budget}</div>
                      <div className="bf-budget">
                        <strong>{money(budget, currency, language)}</strong>
                        <div className="bf-chips" style={{ marginTop: 0 }}>
                          {(["RUB", "THB", "USD"] as Currency[]).map((c) => (
                            <button key={c} type="button" className="bf-chip sm" aria-pressed={currency === c} onClick={() => setCur(c)}>{form.currencies[c]}</button>
                          ))}
                        </div>
                      </div>
                      <input className="bf-range" type="range" aria-label={form.steps.budget} min={BUDGET[currency].min} max={BUDGET[currency].max} step={BUDGET[currency].step} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
                    </div>
                    <div className="bf-group">
                      <div className="bf-label bf-mono">{form.steps.location} · {t.optional}</div>
                      <div className="bf-chips">{opts("location").map((o) => <Chip key={o.id} k="location" id={o.id} sm on={location === o.id} onClick={() => setLocation(location === o.id ? "" : o.id)} />)}</div>
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <div className="bf-group">
                      <div className="bf-label bf-mono">{form.steps.channel}</div>
                      <div className="bf-chips">{opts("channel").map((o) => <Chip key={o.id} k="channel" id={o.id} on={channel === o.id} onClick={() => setChannel(o.id)} />)}</div>
                    </div>
                    <div className="bf-group">
                      <div className="bf-label bf-mono">{form.summaryTitle}</div>
                      <div className="bf-summary">{summary}</div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="bf-foot bf-in">
            <span className="bf-mono bf-dim" style={{ fontSize: 9.5 }}>{t.footer}</span>
            <div className="flex items-center gap-2.5">
              {sent ? (
                <>
                  <button type="button" className="bf-btn ghost" onClick={send}>{t.reopen}</button>
                  <button type="button" className="bf-btn" onClick={close}>{t.close}</button>
                </>
              ) : (
                <>
                  {step > 0 && <button type="button" className="bf-btn ghost" onClick={() => setStep((s) => s - 1)}>← {t.back}</button>}
                  {step < 2 ? (
                    <button type="button" className="bf-btn" disabled={!can[step]} onClick={() => setStep((s) => s + 1)}>{t.next} →</button>
                  ) : (
                    <button type="button" className="bf-btn" disabled={!can.every(Boolean)} onClick={send}>
                      {t.send}
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 11L11 3M5 3h6v6" /></svg>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
