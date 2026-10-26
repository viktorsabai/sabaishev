import { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackConversion } from "@/lib/analytics";
import type { Language } from "@/lib/content";
import { briefContent, type Currency, type Option } from "./content";
import "./brief.css";

// The quick brief, opened from any "Discuss…" button over the blurred page. One question per
// screen, in the order a client thinks: business → what's needed → when → budget → where to
// reply (with a check of the answers). Single-choice steps move on by themselves; the console
// look stays in the background. The answers go out as a prefilled Telegram message, an email,
// or Instagram.

// prefill.biz: a business the page already knows (an id from the brief's business options) —
// it is filled in and the brief starts from the next question.
export type BriefPrefill = { biz?: string };
// Businesses as ordered on /process and /experience, mapped to the brief's business ids.
export const PROCESS_BIZ_IDS = ["realestate", "food", "sport", "beauty", "clinic"];
type BriefApi = { openBrief: (context?: string, prefill?: BriefPrefill) => void };
const BriefCtx = createContext<BriefApi>({ openBrief: () => {} });
export const useBrief = () => useContext(BriefCtx);

export function BriefProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; context?: string; prefill?: BriefPrefill; key: number }>({ open: false, key: 0 });
  const openBrief = useCallback((context?: string, prefill?: BriefPrefill) => {
    trackConversion("brief_start", context ? { context } : undefined);
    setState((s) => ({ open: true, context, prefill, key: s.key + 1 }));
  }, []);
  const api = useMemo(() => ({ openBrief }), [openBrief]);
  return (
    <BriefCtx.Provider value={api}>
      {children}
      {state.open && <BriefConsole key={state.key} context={state.context} prefill={state.prefill} onClose={() => setState((s) => ({ ...s, open: false }))} />}
    </BriefCtx.Provider>
  );
}

const STEPS = ["biz", "need", "when", "budget", "send"] as const;
type Step = (typeof STEPS)[number];
const CURRENCY: Record<Language, Currency> = { ru: "RUB", en: "USD", th: "THB" };
const AUTO_NEXT_MS = 260;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Ticking clock in its own component, so the console doesn't re-render every second.
const Utc = memo(function Utc() {
  const [t, setT] = useState(() => new Date().toISOString().slice(11, 19));
  useEffect(() => {
    const id = window.setInterval(() => setT(new Date().toISOString().slice(11, 19)), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <>{t}</>;
});

function OptionTile({ o, on, multi, index, onPick }: { o: Option; on: boolean; multi?: boolean; index: number; onPick: () => void }) {
  return (
    <button type="button" className={`bo${o.desc ? " wide" : ""}`} aria-pressed={on} onClick={onPick}>
      <span className={`mark${multi ? " sq" : ""}`} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block bo-t">{o.title}</span>
        {o.desc && <span className="block bo-d">{o.desc}</span>}
      </span>
      {index < 9 && <kbd aria-hidden="true">{index + 1}</kbd>}
    </button>
  );
}

function BriefConsole({ context, prefill, onClose }: { context?: string; prefill?: BriefPrefill; onClose: () => void }) {
  const { language } = useLanguage();
  const t = briefContent[language];
  const q = t.questions;
  const knownBiz = q.biz.options.some((o) => o.id === prefill?.biz) ? prefill!.biz! : "";
  const [step, setStep] = useState(knownBiz ? 1 : 0);
  const [biz, setBiz] = useState(knownBiz);
  const [need, setNeed] = useState<string[]>([]);
  const [when, setWhen] = useState("");
  const [currency, setCurrency] = useState<Currency>(CURRENCY[language]);
  const [budget, setBudget] = useState("");
  const [channel, setChannel] = useState("telegram");
  const [sent, setSent] = useState(false);
  const [closing, setClosing] = useState(false);
  const winRef = useRef<HTMLDivElement>(null);
  const autoNext = useRef(0);
  const current: Step = STEPS[step];

  const close = () => {
    if (reducedMotion()) return onClose();
    setClosing(true);
    window.setTimeout(onClose, 280);
  };
  const go = (n: number) => { window.clearTimeout(autoNext.current); setStep(n); };
  // Single-choice answers move on by themselves after a short beat, so the choice is seen.
  const pickAndNext = (set: (v: string) => void, v: string) => {
    set(v);
    window.clearTimeout(autoNext.current);
    autoNext.current = window.setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), reducedMotion() ? 0 : AUTO_NEXT_MS);
  };

  const title = (list: Option[], id: string) => list.find((o) => o.id === id)?.title ?? "";
  const answers = {
    biz: title(q.biz.options, biz),
    need: need.map((id) => title(q.need.options, id)).join(", "),
    when: title(q.when.options, when),
    budget: title(q.budget.options[currency], budget),
    channel: title(q.send.channels, channel),
  };
  const message = [
    t.message, "",
    context ? `${t.summary.context}: ${context}` : "",
    `${t.summary.biz}: ${answers.biz || "—"}`,
    `${t.summary.need}: ${answers.need || "—"}`,
    `${t.summary.when}: ${answers.when || "—"}`,
    `${t.summary.budget}: ${answers.budget || "—"}`,
    `${t.summary.channel}: ${answers.channel}`,
  ].filter((l, i) => i < 2 || l).join("\n");

  const send = () => {
    trackConversion("brief_submit", { biz, need, when, budget, currency, channel, context });
    const body = encodeURIComponent(message);
    if (channel === "telegram") window.open(`https://t.me/bayshev?text=${body}`, "_blank", "noopener,noreferrer");
    else if (channel === "email") window.location.href = `mailto:sabaishev@icloud.com?subject=${encodeURIComponent(t.subject)}&body=${body}`;
    else window.open("https://instagram.com/bayshev", "_blank", "noopener,noreferrer");
    setSent(true);
  };

  // Options of the current step, for rendering and for number-key shortcuts.
  const stepOptions: Option[] =
    current === "biz" ? q.biz.options : current === "need" ? q.need.options : current === "when" ? q.when.options : current === "budget" ? q.budget.options[currency] : q.send.channels;
  const pick = (o: Option) => {
    if (current === "biz") pickAndNext(setBiz, o.id);
    else if (current === "need") setNeed((l) => (l.includes(o.id) ? l.filter((x) => x !== o.id) : [...l, o.id]));
    else if (current === "when") pickAndNext(setWhen, o.id);
    else if (current === "budget") pickAndNext(setBudget, o.id);
    else setChannel(o.id);
  };
  const isOn = (o: Option) =>
    current === "biz" ? biz === o.id : current === "need" ? need.includes(o.id) : current === "when" ? when === o.id : current === "budget" ? budget === o.id : channel === o.id;
  const ready = biz && need.length > 0 && when && budget;

  // Focus the window, keep Tab inside, Esc closes, digits pick options, Enter goes on.
  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    const id = window.setTimeout(() => winRef.current?.querySelector<HTMLElement>(".bo")?.focus(), 420);
    return () => { window.clearTimeout(id); window.clearTimeout(autoNext.current); back?.focus?.(); };
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (!sent && /^[1-9]$/.test(e.key) && stepOptions[Number(e.key) - 1]) return pick(stepOptions[Number(e.key) - 1]);
      if (e.key === "Enter" && !sent && current === "need" && need.length) return go(step + 1);
      if (e.key !== "Tab" || !winRef.current) return;
      const items = Array.from(winRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), a"));
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Breadcrumb of what has been told so far.
  const trail = [answers.biz, answers.need, answers.when, answers.budget].filter(Boolean);
  const blips = trail.length + (sent ? 1 : 0);
  const qOf = current === "send" ? q.send : q[current];

  return (
    <div className={`bf-overlay${closing ? " closing" : ""}`} onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div ref={winRef} className="bf-win" role="dialog" aria-modal="true" aria-labelledby="bf-title">
        <i className="bf-corner tl" /><i className="bf-corner tr" /><i className="bf-corner bl" /><i className="bf-corner br" />
        <div className="bf-band" aria-hidden="true" />

        {/* Background instrumentation: radar and telemetry, deliberately faint */}
        <aside className="bf-rail bf-in" aria-hidden="true">
          <div className="hud">{t.hud.console}</div>
          <div className="bf-radar">
            {[30, 52, 70].map((s) => <i key={s} className="ring" style={{ left: 70 - s, top: 70 - s, width: s * 2, height: s * 2 }} />)}
            <i className="cross" style={{ left: 0, right: 0, top: 69.5, height: 1 }} />
            <i className="cross" style={{ top: 0, bottom: 0, left: 69.5, width: 1 }} />
            <div className="bf-sweep" />
            {Array.from({ length: blips }, (_, i) => {
              const a = i * 2.4 + 0.6, r = 18 + ((i * 17) % 44);
              return <span key={i} className="bf-blip" style={{ left: 70 + Math.cos(a) * r, top: 70 + Math.sin(a) * r, animationDelay: `${i * 0.2}s` }} />;
            })}
          </div>
          <div className="bf-tele hud">
            <div><span>{t.hud.signal}</span><span className="bf-bars">{[0, 1, 2, 3].map((i) => <i key={i} style={{ animationDelay: `${i * 0.15}s` }} />)}</span></div>
            <div><span>LAT</span><span>07.89 N</span></div>
            <div><span>LON</span><span>98.39 E</span></div>
            <div><span>UTC</span><span><Utc /></span></div>
            <div><span>{t.hud.payload}</span><span>{(message.length / 1024).toFixed(2)} KB</span></div>
          </div>
        </aside>

        <div className="bf-main">
          <div className="bf-top bf-in">
            <span className="hud flex items-center gap-2.5"><i className="bf-rec" /> SABAISHEV.ONLINE // {t.hud.channel} · {t.hud.secure}</span>
            <button type="button" className="bf-x" onClick={close} aria-label={t.close}>
              <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" /></svg>
            </button>
          </div>

          {/* Progress and what has been told so far */}
          <div className="bf-progress bf-in">
            <div className="segs" aria-label={`${step + 1} / ${STEPS.length}`}>
              {STEPS.map((s, i) => <i key={s} className={i < step || sent ? "done" : i === step ? "on" : ""} />)}
            </div>
            <div className="trail">
              {context && <span className="ctx">{context}</span>}
              {trail.map((a, i) => <span key={i}>{a}</span>)}
            </div>
          </div>

          <div className="bf-body" key={sent ? "sent" : step}>
            {sent ? (
              <div className="bf-step">
                <div className="bf-dish" aria-hidden="true"><i /><i /><i /></div>
                <h2 id="bf-title" className="bf-title"><span className="gt">{t.sentTitle}</span></h2>
                <p className="bf-hint">{t.sentText}</p>
              </div>
            ) : (
              <div className="bf-step">
                <h2 id="bf-title" className="bf-title">{qOf.title}</h2>
                <p className="bf-hint">{qOf.hint}</p>

                {current === "budget" && (
                  <div className="bf-cur" role="group" aria-label="Currency">
                    {(["RUB", "THB", "USD"] as Currency[]).map((c) => (
                      <button key={c} type="button" aria-pressed={currency === c} onClick={() => { setCurrency(c); setBudget(""); }}>{c === "RUB" ? "₽" : c === "THB" ? "฿" : "$"}</button>
                    ))}
                  </div>
                )}

                {current === "send" && (
                  <dl className="bf-summary">
                    {context && <div><dt>{t.summary.context}</dt><dd>{context}</dd></div>}
                    {(["biz", "need", "when", "budget"] as const).map((k, i) => (
                      <div key={k}>
                        <dt>{t.summary[k]}</dt>
                        <dd>{answers[k] || "—"}</dd>
                        <button type="button" className="edit" onClick={() => go(i)}>{t.edit}</button>
                      </div>
                    ))}
                  </dl>
                )}

                <div className={`bf-options${current === "biz" || current === "send" ? " grid2" : ""}`}>
                  {stepOptions.map((o, i) => (
                    <OptionTile key={o.id} o={o} index={i} multi={current === "need"} on={isOn(o)} onPick={() => pick(o)} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bf-foot bf-in">
            <div className="flex items-center gap-4">
              {!sent && step > 0 && <button type="button" className="bf-back" onClick={() => go(step - 1)}>← {t.back}</button>}
              <span className="hud">{t.footer}</span>
            </div>
            <div className="flex items-center gap-2.5">
              {sent ? (
                <>
                  <button type="button" className="bf-btn ghost" onClick={send}>{t.reopen}</button>
                  <button type="button" className="bf-btn" onClick={close}>{t.close}</button>
                </>
              ) : current === "need" ? (
                <button type="button" className="bf-btn" disabled={!need.length} title={need.length ? undefined : t.choose} onClick={() => go(step + 1)}>{t.next} →</button>
              ) : current === "send" ? (
                <button type="button" className="bf-btn" disabled={!ready} onClick={send}>
                  {t.send}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 11L11 3M5 3h6v6" /></svg>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
