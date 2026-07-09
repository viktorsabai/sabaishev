import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import { progressGradient, systemNumber, textGradient } from "@/lib/systemUi";

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const { language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const title = content[language].boot.title;
  const ready =
    language === "ru" ? "Готов" : language === "th" ? "พร้อม" : "Ready";

  useEffect(() => {
    const hasSeenBoot = sessionStorage.getItem("boot-completed");
    if (hasSeenBoot) {
      onComplete();
      return;
    }

    const start = performance.now();
    const duration = 1600;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("boot-completed", "true");
        setTimeout(onComplete, 480);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Atmospheric field */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.22) 0%, rgba(59,130,246,0.1) 45%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[15%] top-[30%] h-56 w-56 rounded-full blur-[80px] opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ x: [0, -24, 0], y: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[12%] bottom-[28%] h-64 w-64 rounded-full blur-[90px] opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className={`mb-8 text-[11px] ${systemNumber.label} ${textGradient}`}
        >
          Boot
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mb-10 text-3xl md:text-4xl font-bold tracking-tight text-foreground"
        >
          {title}
        </motion.h1>

        <div className="mx-auto mb-5 h-[3px] w-full max-w-[240px] overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={`h-full rounded-full ${progressGradient}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${systemNumber.display} text-base ${
            progress < 100 ? textGradient : "text-foreground-secondary"
          }`}
        >
          {progress < 100 ? `${progress}%` : ready}
        </motion.p>
      </div>
    </motion.div>
  );
}
