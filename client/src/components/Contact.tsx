import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import { Check, ChevronLeft, Send } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";
import {
  progressGradient,
  systemNumber,
  systemTag,
  textGradient,
} from "@/lib/systemUi";
import { Slider } from "@/components/ui/slider";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

type Currency = "RUB" | "THB" | "USD";

const BUDGET_RANGES: Record<Currency, { min: number; max: number; step: number }> = {
  RUB: { min: 100_000, max: 5_000_000, step: 50_000 },
  THB: { min: 30_000, max: 1_500_000, step: 10_000 },
  USD: { min: 1_000, max: 50_000, step: 500 },
};

function formatBudget(value: number, currency: Currency, locale: string) {
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value);
  if (currency === "RUB") return `${formatted} ₽`;
  if (currency === "THB") return `฿${formatted}`;
  return `$${formatted}`;
}

type Opt = { id: string; label: string };

function toggleInList(list: string[], id: string) {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function Chip({
  label,
  selected,
  onClick,
  multi,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${systemTag.base} ${
        selected ? systemTag.active : systemTag.idle
      } cursor-pointer inline-flex items-center gap-1.5`}
    >
      {multi && selected && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />}
      {label}
    </button>
  );
}

export default function Contact() {
  const { language } = useLanguage();
  const contact = content[language].contact;
  const form = contact.form;
  const locale = language === "ru" ? "ru-RU" : language === "th" ? "th-TH" : "en-US";

  const [need, setNeed] = useState<string[]>([]);
  const [domain, setDomain] = useState<string[]>([]);
  const defaultCurrency: Currency =
    language === "th" ? "THB" : language === "ru" ? "RUB" : "USD";
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [budget, setBudget] = useState(
    () => BUDGET_RANGES[defaultCurrency].min * 5
  );
  const [location, setLocation] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [channel, setChannel] = useState<string>("telegram");
  const [sent, setSent] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const range = BUDGET_RANGES[currency];

  const steps = useMemo(
    () => [
      { id: "need", title: form.steps.need, done: need.length > 0 },
      { id: "domain", title: form.steps.domain, done: domain.length > 0 },
      { id: "budget", title: form.steps.budget, done: true },
      { id: "location", title: form.steps.location, done: Boolean(location) },
      { id: "timeline", title: form.steps.timeline, done: Boolean(timeline) },
      { id: "channel", title: form.steps.channel, done: Boolean(channel) },
    ],
    [form.steps, need, domain, location, timeline, channel]
  );

  const canSubmit =
    need.length > 0 && domain.length > 0 && location && timeline && channel;

  const canGoNext = steps[activeStep]?.done;

  const briefText = useMemo(() => {
    const needLabels = need
      .map((id) => (form.options.need as Opt[]).find((o) => o.id === id)?.label)
      .filter(Boolean)
      .join(", ");
    const domainLabels = domain
      .map((id) => (form.options.domain as Opt[]).find((o) => o.id === id)?.label)
      .filter(Boolean)
      .join(", ");
    const locationLabel = (form.options.location as Opt[]).find((o) => o.id === location)?.label;
    const timelineLabel = (form.options.timeline as Opt[]).find((o) => o.id === timeline)?.label;
    const channelLabel = (form.options.channel as Opt[]).find((o) => o.id === channel)?.label;

    return [
      `${form.summary.need}: ${needLabels || "—"}`,
      `${form.summary.domain}: ${domainLabels || "—"}`,
      `${form.summary.budget}: ${formatBudget(budget, currency, locale)}`,
      `${form.summary.location}: ${locationLabel || "—"}`,
      `${form.summary.timeline}: ${timelineLabel || "—"}`,
      `${form.summary.channel}: ${channelLabel || "—"}`,
    ].join("\n");
  }, [need, domain, budget, currency, location, timeline, channel, form, locale]);

  const handleCurrency = (next: Currency) => {
    const prev = BUDGET_RANGES[currency];
    const nextRange = BUDGET_RANGES[next];
    const ratio = (budget - prev.min) / (prev.max - prev.min);
    const mapped = Math.round(nextRange.min + ratio * (nextRange.max - nextRange.min));
    const snapped = Math.round(mapped / nextRange.step) * nextRange.step;
    setCurrency(next);
    setBudget(Math.min(nextRange.max, Math.max(nextRange.min, snapped)));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const body = `${form.submitMessage}\n\n${briefText}`;
    const encoded = encodeURIComponent(body);

    if (channel === "telegram") {
      window.open(
        `https://t.me/bayshev?text=${encoded}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else if (channel === "email") {
      window.location.href = `mailto:sabaishev@icloud.com?subject=${encodeURIComponent(form.submitSubject)}&body=${encoded}`;
    } else {
      window.open(contact.links.instagram, "_blank", "noopener,noreferrer");
    }
    setSent(true);
  };

  const goNext = () => {
    if (activeStep < steps.length - 1 && canGoNext) {
      setActiveStep((s) => s + 1);
    }
  };

  return (
    <ScrollReveal type="reveal" duration={0.8}>
      <section
        id="contact"
        className="relative min-h-screen flex items-center justify-center py-20 px-4 bg-background"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-7xl"
        >
          <SectionHeader
            number={5}
            title={contact.title}
            subtitle={form.subtitle}
          />

          <div className="rounded-2xl border border-border/60 bg-surface/40 backdrop-blur-md overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[520px] lg:min-h-[580px]">
              {/* LEFT — steps */}
              <aside className="lg:w-[280px] xl:w-[300px] border-b lg:border-b-0 lg:border-r border-border/50 bg-background/40">
                <div className="px-4 pt-4 pb-2 lg:px-5 lg:pt-6">
                  <p
                    className={`${systemNumber.label} text-[10px] text-foreground-muted/70 mb-3`}
                  >
                    {form.briefLabel}
                  </p>
                </div>

                <LayoutGroup>
                  <nav
                    className="flex flex-row lg:flex-col gap-1 px-3 pb-4 lg:px-3 lg:pb-6 overflow-x-auto"
                    aria-label="Brief steps"
                  >
                    {steps.map((step, index) => {
                      const isActive = index === activeStep;
                      return (
                        <button
                          key={step.id}
                          type="button"
                          onClick={() => setActiveStep(index)}
                          className="relative flex-shrink-0 lg:w-full text-left px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-xl transition-colors"
                        >
                          {isActive && (
                            <motion.div
                              layoutId="contactActiveStep"
                              className="absolute inset-0 rounded-xl bg-white/[0.05] border border-white/12"
                              transition={SPRING}
                            />
                          )}
                          <span
                            className={`relative z-10 flex items-center gap-2 text-sm font-medium whitespace-nowrap ${
                              isActive
                                ? "text-foreground"
                                : step.done
                                  ? "text-foreground-secondary"
                                  : "text-foreground-muted"
                            }`}
                          >
                            <span
                              className={`${systemNumber.label} text-[11px] ${
                                isActive
                                  ? textGradient
                                  : step.done
                                    ? "text-foreground-secondary"
                                    : ""
                              }`}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="truncate">{step.title}</span>
                            {step.done && !isActive && (
                              <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-foreground-muted" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </LayoutGroup>
              </aside>

              {/* RIGHT */}
              <div className="flex-1 flex flex-col min-w-0 p-5 md:p-8 lg:p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={steps[activeStep].id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28 }}
                    className="flex flex-col flex-1"
                  >
                    <div className="mb-7 md:mb-9">
                      <p className={`${systemNumber.label} text-sm mb-3 ${textGradient}`}>
                        {String(activeStep + 1).padStart(2, "0")} /{" "}
                        {String(steps.length).padStart(2, "0")}
                      </p>
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">
                        {steps[activeStep].title}
                      </h3>
                      <p className="text-sm text-foreground-secondary">
                        {form.hints[steps[activeStep].id as keyof typeof form.hints]}
                      </p>
                    </div>

                    {activeStep === 0 && (
                      <div className="flex flex-wrap gap-2.5">
                        {(form.options.need as Opt[]).map((opt) => (
                          <Chip
                            key={opt.id}
                            label={opt.label}
                            selected={need.includes(opt.id)}
                            multi
                            onClick={() => setNeed(toggleInList(need, opt.id))}
                          />
                        ))}
                      </div>
                    )}

                    {activeStep === 1 && (
                      <div className="flex flex-wrap gap-2.5">
                        {(form.options.domain as Opt[]).map((opt) => (
                          <Chip
                            key={opt.id}
                            label={opt.label}
                            selected={domain.includes(opt.id)}
                            multi
                            onClick={() => setDomain(toggleInList(domain, opt.id))}
                          />
                        ))}
                      </div>
                    )}

                    {activeStep === 2 && (
                      <div className="space-y-8 max-w-xl">
                        <div className="flex flex-wrap gap-2">
                          {(["RUB", "THB", "USD"] as Currency[]).map((c) => (
                            <Chip
                              key={c}
                              label={form.currencies[c]}
                              selected={currency === c}
                              onClick={() => handleCurrency(c)}
                            />
                          ))}
                        </div>
                        <div>
                          <p
                            className={`${systemNumber.display} ${textGradient} text-4xl md:text-5xl tracking-tight mb-6`}
                          >
                            {formatBudget(budget, currency, locale)}
                          </p>
                          <Slider
                            min={range.min}
                            max={range.max}
                            step={range.step}
                            value={[budget]}
                            onValueChange={(v) => setBudget(v[0] ?? range.min)}
                            className="w-full [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-pink-500 [&_[data-slot=slider-range]]:via-purple-500 [&_[data-slot=slider-range]]:to-blue-500 [&_[data-slot=slider-thumb]]:border-purple-400/60 [&_[data-slot=slider-thumb]]:bg-foreground"
                          />
                          <div className="mt-3 flex justify-between text-[11px] text-foreground-muted">
                            <span>{formatBudget(range.min, currency, locale)}</span>
                            <span>{formatBudget(range.max, currency, locale)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStep === 3 && (
                      <div className="flex flex-wrap gap-2.5">
                        {(form.options.location as Opt[]).map((opt) => (
                          <Chip
                            key={opt.id}
                            label={opt.label}
                            selected={location === opt.id}
                            onClick={() => setLocation(opt.id)}
                          />
                        ))}
                      </div>
                    )}

                    {activeStep === 4 && (
                      <div className="flex flex-wrap gap-2.5">
                        {(form.options.timeline as Opt[]).map((opt) => (
                          <Chip
                            key={opt.id}
                            label={opt.label}
                            selected={timeline === opt.id}
                            onClick={() => setTimeline(opt.id)}
                          />
                        ))}
                      </div>
                    )}

                    {activeStep === 5 && (
                      <div className="flex flex-wrap gap-2.5">
                        {(form.options.channel as Opt[]).map((opt) => (
                          <Chip
                            key={opt.id}
                            label={opt.label}
                            selected={channel === opt.id}
                            onClick={() => setChannel(opt.id)}
                          />
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-12 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                        disabled={activeStep === 0}
                        className={`inline-flex items-center gap-1.5 text-sm transition-colors ${
                          activeStep === 0
                            ? "text-foreground-muted/40 cursor-default"
                            : "text-foreground-secondary hover:text-foreground"
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {language === "ru" ? "Назад" : language === "th" ? "กลับ" : "Back"}
                      </button>

                      {activeStep < steps.length - 1 ? (
                        <motion.button
                          type="button"
                          whileHover={{ scale: canGoNext ? 1.02 : 1 }}
                          whileTap={{ scale: canGoNext ? 0.98 : 1 }}
                          disabled={!canGoNext}
                          onClick={goNext}
                          className={`px-7 py-3 rounded-xl text-sm font-semibold transition-opacity ${
                            canGoNext
                              ? "bg-foreground text-background"
                              : "bg-white/8 text-foreground-muted cursor-not-allowed"
                          }`}
                        >
                          {form.next}
                        </motion.button>
                      ) : (
                        <motion.button
                          type="button"
                          whileHover={{ scale: canSubmit ? 1.02 : 1 }}
                          whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                          disabled={!canSubmit}
                          onClick={handleSubmit}
                          className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold ${
                            canSubmit
                              ? "bg-foreground text-background"
                              : "bg-white/8 text-foreground-muted cursor-not-allowed"
                          }`}
                        >
                          <Send className="h-4 w-4" />
                          {sent ? form.sent : form.submit}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${progressGradient}`}
                    animate={{
                      width: `${((activeStep + 1) / steps.length) * 100}%`,
                    }}
                    transition={{ duration: 0.35 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </ScrollReveal>
  );
}
