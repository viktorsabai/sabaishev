import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";

type Phase = "think" | "type" | "hold" | "erase";

function TypingDots() {
  return (
    <span className="inline-flex h-[1.15em] items-center gap-[5px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-[5px] w-[5px] rounded-full bg-foreground/45"
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1, 0.85] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
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
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("think");
  const timerRef = useRef<number | null>(null);

  const message = messages[index % messages.length];

  useEffect(() => {
    setIndex(0);
    setText("");
    setPhase("think");
  }, [language]);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (phase === "think") {
      timerRef.current = window.setTimeout(() => {
        setText("");
        setPhase("type");
      }, 2200 + Math.random() * 1600);
    } else if (phase === "type") {
      if (text.length < message.length) {
        const ch = message[text.length];
        let delay = 95 + Math.random() * 75;
        if (ch === " " || ch === "·") delay = 140 + Math.random() * 100;
        if (".,!?—-".includes(ch)) delay = 380 + Math.random() * 320;

        timerRef.current = window.setTimeout(() => {
          setText(message.slice(0, text.length + 1));
        }, delay);
      } else {
        timerRef.current = window.setTimeout(() => setPhase("hold"), 500);
      }
    } else if (phase === "hold") {
      timerRef.current = window.setTimeout(() => setPhase("erase"), 6500);
    } else if (phase === "erase") {
      if (text.length > 0) {
        timerRef.current = window.setTimeout(() => {
          setText((t) => t.slice(0, -1));
        }, 28 + Math.random() * 18);
      } else {
        timerRef.current = window.setTimeout(() => {
          setIndex((i) => (i + 1) % messages.length);
          setPhase("think");
        }, 900);
      }
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase, text, message, messages.length]);

  const showDots = phase === "think";
  const showCursor = phase === "type" || phase === "erase";

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className="shrink-0 text-[34px] leading-none md:text-[38px]"
        aria-hidden
      >
        {"🧚‍♀️"}
      </span>

      <div
        className="flex min-h-9 min-w-0 max-w-[min(58vw,20rem)] items-center rounded-[20px] rounded-bl-[6px] border border-white/[0.08] bg-white/[0.06] px-3.5 py-2 md:max-w-md md:min-h-10 md:px-4"
        title={status}
      >
        <p className="min-w-0 truncate text-[13px] leading-none text-foreground/90 md:text-[14px]">
          {showDots ? (
            <TypingDots />
          ) : (
            <>
              {text}
              {showCursor && (
                <span className="ml-[1px] inline-block animate-pulse text-foreground/40">
                  |
                </span>
              )}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
