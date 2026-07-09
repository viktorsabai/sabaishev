import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";

type Phase = "think" | "type" | "hold" | "pause";

function charDelay(char: string): number {
  if (char === " " || char === "·") return 110 + Math.random() * 90;
  if (".,!?—-".includes(char)) return 320 + Math.random() * 280;
  return 72 + Math.random() * 88;
}

function thinkDelay(): number {
  return 1800 + Math.random() * 1400;
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-0.5 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-foreground-muted"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{
            duration: 1.05,
            repeat: Infinity,
            delay: i * 0.17,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export default function HeaderTypingPresence() {
  const { language } = useLanguage();
  const { title, status, messages } = content[language].header;
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("think");

  const message = messages[index % messages.length];

  useEffect(() => {
    setIndex(0);
    setText("");
    setPhase("think");
  }, [language]);

  useEffect(() => {
    setText("");
    setPhase("think");
  }, [index, message]);

  useEffect(() => {
    if (phase !== "think") return;
    const t = window.setTimeout(() => setPhase("type"), thinkDelay());
    return () => window.clearTimeout(t);
  }, [phase, index, message]);

  useEffect(() => {
    if (phase !== "type") return;

    if (text.length < message.length) {
      const nextChar = message[text.length];
      const t = window.setTimeout(() => {
        setText(message.slice(0, text.length + 1));
      }, charDelay(nextChar));
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => setPhase("hold"), 400);
    return () => window.clearTimeout(t);
  }, [phase, text, message]);

  useEffect(() => {
    if (phase !== "hold") return;
    const t = window.setTimeout(() => setPhase("pause"), 7000);
    return () => window.clearTimeout(t);
  }, [phase, index]);

  useEffect(() => {
    if (phase !== "pause") return;
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 1400);
    return () => window.clearTimeout(t);
  }, [phase, messages.length]);

  const showDots = phase === "think" || (phase === "type" && text.length === 0);
  const showCursor = phase === "type" && text.length > 0;

  return (
    <div className="flex min-w-0 max-w-[min(100%,17rem)] items-end gap-2 sm:max-w-xs md:max-w-sm">
      <span
        className="shrink-0 pb-0.5 text-[28px] leading-none md:text-[32px]"
        aria-hidden
      >
        {"🧚🏿‍♀️"}
      </span>

      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-1.5 pl-0.5">
          <span className="text-[11px] font-medium leading-none text-foreground-secondary">
            {title}
          </span>
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/90"
            title={status}
            aria-hidden
          />
        </div>

        <div className="min-w-[3.25rem] rounded-[18px] rounded-bl-[5px] border border-border/50 bg-foreground/[0.07] px-3 py-2 shadow-sm backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {showDots ? (
              <motion.div
                key="dots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <TypingDots />
              </motion.div>
            ) : (
              <motion.p
                key={`msg-${index}`}
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 1 }}
                className="text-[13px] leading-snug text-foreground/90"
              >
                <span className="line-clamp-2">{text}</span>
                {showCursor && (
                  <span className="ml-px animate-pulse text-foreground/45">|</span>
                )}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
