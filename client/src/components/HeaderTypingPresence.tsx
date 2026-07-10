import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import FairyMark from "./FairyMark";

type Phase = "typing" | "message";

const TYPING_MS = 1400;
const MESSAGE_MS = 5200;
const FADE = { duration: 0.28, ease: [0.23, 1, 0.32, 1] as const };

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-[5px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-[5px] w-[5px] rounded-full bg-foreground/50"
          animate={{ y: [0, -2, 0], opacity: [0.3, 0.85, 0.3] }}
          transition={{
            duration: 0.85,
            repeat: Infinity,
            delay: i * 0.14,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export default function HeaderTypingPresence() {
  const { language } = useLanguage();
  const { status, messages } = content[language].header;
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const timerRef = useRef<number | null>(null);

  const message = messages[index % messages.length];
  const longestMessage = useMemo(
    () => messages.reduce((a, b) => (a.length >= b.length ? a : b), ""),
    [messages]
  );

  useEffect(() => {
    setIndex(0);
    setPhase("typing");
  }, [language]);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (phase === "typing") {
      timerRef.current = window.setTimeout(() => setPhase("message"), TYPING_MS);
    } else {
      timerRef.current = window.setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length);
        setPhase("typing");
      }, MESSAGE_MS);
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase, messages.length]);

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <FairyMark className="h-[32px] w-[32px] shrink-0 md:h-[34px] md:w-[34px]" />

      <div
        className="relative h-9 shrink-0 rounded-[18px] rounded-bl-[5px] border border-white/[0.06] bg-white/[0.04] shadow-[0_10px_28px_-18px_rgba(0,0,0,0.85)] backdrop-blur-sm md:h-[38px]"
        title={status}
        aria-live="polite"
        aria-atomic
      >
        {/* Invisible spacer locks width to the longest phrase — no horizontal jump */}
        <span
          className="invisible block px-3.5 py-2 text-[13px] font-medium leading-none md:px-4 md:text-[14px]"
          aria-hidden
        >
          {longestMessage}
        </span>

        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center px-3.5 md:px-4"
          animate={{ opacity: phase === "typing" ? 1 : 0 }}
          transition={FADE}
          aria-hidden={phase !== "typing"}
        >
          <TypingDots />
        </motion.div>

        <motion.p
          className="pointer-events-none absolute inset-0 flex items-center truncate px-3.5 text-[13px] font-medium leading-none tracking-[-0.01em] text-foreground/88 md:px-4 md:text-[14px]"
          animate={{ opacity: phase === "message" ? 1 : 0 }}
          transition={FADE}
          aria-hidden={phase !== "message"}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}
