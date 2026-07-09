import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const { language } = useLanguage();
  const line = content[language].boot.line;
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");

  useEffect(() => {
    const hasSeenBoot = sessionStorage.getItem("boot-completed");
    if (hasSeenBoot) {
      onComplete();
      return;
    }

    const hold = window.setTimeout(() => setPhase("hold"), 900);
    const exit = window.setTimeout(() => setPhase("exit"), 2400);
    const done = window.setTimeout(() => {
      sessionStorage.setItem("boot-completed", "true");
      onComplete();
    }, 3100);

    return () => {
      window.clearTimeout(hold);
      window.clearTimeout(exit);
      window.clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0B0B0D]"
    >
      {/* Soft bloom — one light, not three competing blobs */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] md:h-[36rem] md:w-[36rem]"
        initial={{ opacity: 0, scale: 0.55 }}
        animate={{
          opacity: phase === "exit" ? 0 : [0, 0.85, 0.7],
          scale: phase === "exit" ? 1.35 : [0.55, 1.05, 1],
        }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            "radial-gradient(circle, rgba(236,72,153,0.28) 0%, rgba(168,85,247,0.18) 38%, rgba(59,130,246,0.08) 62%, transparent 75%)",
        }}
      />

      {/* Slow breath ring */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08] md:h-52 md:w-52"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{
          opacity: phase === "exit" ? 0 : [0, 0.55, 0.25],
          scale: phase === "exit" ? 1.4 : [0.7, 1.08, 1],
        }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      />

      <div className="relative z-10 flex flex-col items-center px-6">
        <motion.span
          className="select-none text-[72px] leading-none drop-shadow-[0_0_40px_rgba(236,72,153,0.35)] md:text-[96px]"
          initial={{ opacity: 0, scale: 0.6, filter: "blur(12px)" }}
          animate={{
            opacity: phase === "exit" ? 0 : 1,
            scale: phase === "exit" ? 1.12 : 1,
            filter: phase === "exit" ? "blur(8px)" : "blur(0px)",
            y: phase === "hold" || phase === "exit" ? [0, -6, 0] : 0,
          }}
          transition={{
            opacity: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
            filter: { duration: 1, ease: [0.22, 1, 0.36, 1] },
            y:
              phase === "hold"
                ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.6 },
          }}
          aria-hidden
        >
          {"🧚‍♀️"}
        </motion.span>

        <motion.p
          className="mt-8 max-w-[16rem] text-center text-[13px] font-medium tracking-[0.04em] text-foreground/70 md:mt-10 md:max-w-xs md:text-[15px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: phase === "exit" ? 0 : 1,
            y: phase === "exit" ? -6 : 0,
          }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {line}
        </motion.p>

        {/* Quiet pulse — no %, no bar chrome */}
        <motion.div
          className="mt-10 h-[2px] w-16 overflow-hidden rounded-full bg-white/10 md:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "exit" ? 0 : 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
