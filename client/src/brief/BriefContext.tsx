import { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackConversion } from "@/lib/analytics";
import type { Language } from "@/lib/content";
import { briefContent, type Currency, type Option } from "./content";
import "./brief.css";

// The quick brief, opened from any "Discuss…" button over the blurred page. One compact screen
// in the order a client thinks — business, what's needed (chips), when and budget (sliders) —
// with the request written up live in the console panel at the side, where the reply channel
// and the send button are. The answers go out as a prefilled Telegram message, an email, or
// Instagram.

// prefill: what the page already knows (ids from the brief's options) is marked in advance.
export type BriefPrefill = { biz?: string; need?: string[] };
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

const CURRENCY: Record<Language, Currency> = { ru: "RUB", en: "USD", th: "THB" };
const SYMBOL: Record<Currency, string> = { RUB: "₽", THB: "฿", USD: "$" };
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Ticking clock in its own component, so the window doesn't re-render every second.
const Utc = memo(function Utc() {
  const [t, setT] = useState(() => new Date().toISOString().slice(11, 19));
  useEffect(() => {
    const id = window.setInterval(() => setT(new Date().toISOString().slice(11, 19)), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <>{t}</>;
});

function Section({ n, label, active, done, aside, children }: { n: number; label: string; active: boolean; done: boolean; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className={`bq${active ? " act" : ""}${done ? " done" : ""}`} style={{ animationDelay: `${0.25 + n * 0.06}s` }}>
      <header>
        <span className="n">0{n}</span>
        <span className="l">{label}</span>
        {aside}
      </header>
      {children}
    </section>
  );
}

// A slider over a few named stops. Until it is touched it sits in the middle, dimmed, and
// counts as not answered.
function Stops({ label, stops, value, onChange }: { label: string; stops: Option[]; value: number | null; onChange: (v: number) => void }) {
  const shown = value ?? Math.floor((stops.length - 1) / 2);
  const max = stops.length - 1;
  return (
    <div className={`bs${value === null ? " idle" : ""}`}>
      <div className="bs-val" aria-hidden="true">{stops[shown].title}</div>
      <input
        type="range" min={0} max={max} step={1} value={shown}
        aria-label={label} aria-valuetext={value === null ? "—" : stops[value].title}
        style={{ ["--p" as string]: `${(shown / max) * 100}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={() => value === null && onChange(shown)}
        onKeyUp={(e) => value === null && (e.key === "Enter" || e.key === " ") && onChange(shown)}
      />
      <div className="bs-ticks">
        {stops.map((o, i) => (
          <button key={o.id} type="button" tabIndex={-1} aria-hidden="true" className={value !== null && i <= value ? "on" : undefined} style={{ left: `${(i / max) * 100}%` }} onClick={() => onChange(i)} />
        ))}
      </div>
    </div>
  );
}

function BriefConsole({ context, prefill, onClose }: { context?: string; prefill?: BriefPrefill; onClose: () => void }) {
  const { language } = useLanguage();
  const t = briefContent[language];
  const q = t.questions;
  const w = t.window;
  const [biz, setBiz] = useState(() => (q.biz.options.some((o) => o.id === prefill?.biz) ? prefill!.biz! : ""));
  const [need, setNeed] = useState<string[]>(() => (prefill?.need ?? []).filter((id) => q.need.options.some((o) => o.id === id)));
  const [when, setWhen] = useState<number | null>(null);
  const [currency, setCurrency] = useState<Currency>(CURRENCY[language]);
  const [budget, setBudget] = useState<number | null>(null);
  const [unsure, setUnsure] = useState(false);
  const [channel, setChannel] = useState("telegram");
  const [sent, setSent] = useState(false);
  const [closing, setClosing] = useState(false);
  const winRef = useRef<HTMLDivElement>(null);

  const close = () => {
    if (reducedMotion()) return onClose();
    setClosing(true);
    window.setTimeout(onClose, 280);
  };

  const ranges = q.budget.options[currency].filter((o) => o.id !== "b0");
  const title = (list: Option[], id: string) => list.find((o) => o.id === id)?.title ?? "";
  const answers = {
    biz: title(q.biz.options, biz),
    need: need.map((id) => title(q.need.options, id)).join(", "),
    when: when === null ? "" : q.when.options[when].title,
    budget: unsure ? w.unknown : budget === null ? "" : ranges[budget].title,
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
  const ready = Boolean(biz && need.length);
  // The first section still waiting for an answer is lit, so the eye knows where to go next.
  const pending = !biz ? 1 : !need.length ? 2 : when === null ? 3 : budget === null && !unsure ? 4 : 0;

  const send = () => {
    if (!ready) return;
    const budgetId = unsure ? "b0" : budget === null ? "" : ranges[budget].id;
    const whenId = when === null ? "" : q.when.options[when].id;
    trackConversion("brief_submit", { biz, need, when: whenId, budget: budgetId, currency, channel, context });
    const body = encodeURIComponent(message);
    if (channel === "telegram") window.open(`https://t.me/bayshev?text=${body}`, "_blank", "noopener,noreferrer");
    else if (channel === "email") window.location.href = `mailto:sabaishev@icloud.com?subject=${encodeURIComponent(t.subject)}&body=${body}`;
    else window.open("https://instagram.com/bayshev", "_blank", "noopener,noreferrer");
    setSent(true);
  };

  // Focus the window, keep Tab inside, Esc closes.
  useEffect(() => {
    const back = document.activeElement as HTMLElement | null;
    const id = window.setTimeout(() => winRef.current?.querySelector<HTMLElement>(".bc2")?.focus(), 380);
    return () => { window.clearTimeout(id); back?.focus?.(); };
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !winRef.current) return;
      const items = Array.from(winRef.current.querySelectorAll<HTMLElement>("button:not(:disabled):not([tabindex='-1']), a, input"));
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // The request as the console writes it: one line per answer, re-keyed so a changed line flashes.
  const str = (v: string) => (v ? <span className="k2">"{v}"</span> : <span className="k0">null</span>);
  const log: [string, ReactNode, string][] = [
    ...(context ? [[t.summary.context, str(context), context] as [string, ReactNode, string]] : []),
    [t.summary.biz, str(answers.biz), answers.biz],
    [t.summary.need, need.length ? <span className="k2">[{need.map((id) => `"${title(q.need.options, id)}"`).join(", ")}]</span> : <span className="k0">[]</span>, answers.need],
    [t.summary.when, str(answers.when), answers.when],
    [t.summary.budget, str(answers.budget), answers.budget],
  ];

  return (
    <div className={`bf-overlay${closing ? " closing" : ""}`} onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div ref={winRef} className="bf-win" role="dialog" aria-modal="true" aria-labelledby="bf-title">
        <i className="bf-corner tl" /><i className="bf-corner tr" /><i className="bf-corner bl" /><i className="bf-corner br" />

        <div className="bf-main">
          <div className="bf-top bf-in">
            <span className="hud flex items-center gap-2.5"><i className="bf-rec" /> SABAISHEV.ONLINE // {t.hud.channel} · {t.hud.secure}</span>
          </div>
          {sent ? (
            <div className="bf-done">
              <div className="bf-dish" aria-hidden="true"><i /><i /><i /></div>
              <h2 id="bf-title" className="bf-title"><span className="gt">{t.sentTitle}</span></h2>
              <p className="bf-hint">{t.sentText}</p>
              <div className="mt-6 flex gap-2.5">
                <button type="button" className="bf-btn ghost" onClick={send}>{t.reopen}</button>
                <button type="button" className="bf-btn" onClick={close}>{t.close}</button>
              </div>
            </div>
          ) : (
            <div className="bf-form">
              <h2 id="bf-title" className="bf-title bf-in">{w.title}</h2>
              <p className="bf-hint bf-in">{w.hint}</p>

              <Section n={1} label={t.summary.biz} active={pending === 1} done={!!biz}>
                <div className="bchips" role="radiogroup" aria-label={t.summary.biz}>
                  {q.biz.options.map((o) => (
                    <button key={o.id} type="button" role="radio" className="bc2" aria-checked={biz === o.id} onClick={() => setBiz(o.id)}>{o.title}</button>
                  ))}
                </div>
              </Section>

              <Section n={2} label={t.summary.need} active={pending === 2} done={need.length > 0}>
                <div className="bchips" role="group" aria-label={t.summary.need}>
                  {q.need.options.map((o) => (
                    <button key={o.id} type="button" className="bc2 sq" title={o.desc} aria-pressed={need.includes(o.id)} onClick={() => setNeed((l) => (l.includes(o.id) ? l.filter((x) => x !== o.id) : [...l, o.id]))}>
                      <i aria-hidden="true" />{o.title}
                    </button>
                  ))}
                </div>
              </Section>

              <div className="bq-row">
                <Section n={3} label={t.summary.when} active={pending === 3} done={when !== null}>
                  <Stops label={t.summary.when} stops={q.when.options} value={when} onChange={setWhen} />
                </Section>
                <Section
                  n={4} label={t.summary.budget} active={pending === 4} done={budget !== null || unsure}
                  aside={
                    <span className="bcur" role="group" aria-label="Currency">
                      {(["RUB", "THB", "USD"] as Currency[]).map((c) => (
                        <button key={c} type="button" aria-pressed={currency === c} onClick={() => setCurrency(c)}>{SYMBOL[c]}</button>
                      ))}
                    </span>
                  }
                >
                  <div className={unsure ? "bs-off" : undefined}>
                    <Stops label={t.summary.budget} stops={ranges} value={unsure ? null : budget} onChange={(v) => { setBudget(v); setUnsure(false); }} />
                  </div>
                  <button type="button" className="bunsure" aria-pressed={unsure} onClick={() => setUnsure((u) => !u)}><i aria-hidden="true" />{w.unknown}</button>
                </Section>
              </div>
            </div>
          )}
        </div>

        {/* The console: the request written up as it is filled in, where to reply, send */}
        <aside className="bf-log">
          <div className="bf-logtop bf-in">
            <span className="hud">{t.hud.console}</span>
            <button type="button" className="bf-x" onClick={close} aria-label={t.close}>
              <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" /></svg>
            </button>
          </div>
          <div className="bf-code bf-in" aria-live="polite">
            <div><span className="k1">const</span> {w.log} <span className="k3">=</span> {"{"}</div>
            {log.map(([k, v, raw]) => (
              <div key={`${k}${raw}`} className={`in${raw ? " flash" : ""}`}>{k.toLowerCase()}<span className="k3">:</span> {v}<span className="k3">,</span></div>
            ))}
            <div>{"}"}</div>
            <div className="k0 cm">// {ready ? t.footer : w.required}</div>
          </div>

          <div className="bf-send bf-in">
            <div className="hud">{t.summary.channel}</div>
            <div className="bf-ch" role="radiogroup" aria-label={t.summary.channel}>
              {q.send.channels.map((c) => (
                <button key={c.id} type="button" role="radio" aria-checked={channel === c.id} onClick={() => setChannel(c.id)}>{c.title}</button>
              ))}
            </div>
            <button type="button" className="bf-btn wide" disabled={!ready || sent} onClick={send}>
              {t.send}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 11L11 3M5 3h6v6" /></svg>
            </button>
            <div className="hud flex justify-between"><span>{w.replyHint}</span><span>UTC <Utc /></span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
