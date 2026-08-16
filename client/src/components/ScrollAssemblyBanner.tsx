import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { systemNumber, textGradient } from "@/lib/systemUi";

export default function ScrollAssemblyBanner() {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.35, 0.7, 0.9], [0, 1, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0.1, 0.4], [0.94, 1]);
  const y = useTransform(scrollYProgress, [0.1, 0.4], [40, 0]);

  const text = {
    ru: {
      eyebrow: "Единая система",
      title: "Каждое звено работает на вашу задачу",
      desc: "Интерфейс собирается на лету: от архитектуры и ИИ-агентов до нативного кода и конверсионной воронки.",
    },
    en: {
      eyebrow: "Unified System",
      title: "Every layer builds toward your objective",
      desc: "Assembled live as you scroll: from architecture and AI agents to native code and conversion funnels.",
    },
    th: {
      eyebrow: "ระบบเดียว",
      title: "ทุกส่วนประกอบทำงานเพื่อเป้าหมายของคุณ",
      desc: "ประกอบร่างทันทีที่คุณเลื่อน: จากสถาปัตยกรรมและ AI สู่โค้ดเนทีฟและฟनलแปลงผู้ใช้",
    },
  }[language];

  return (
    <section ref={containerRef} className="relative py-24 md:py-32 px-4 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[350px] rounded-full opacity-20 blur-[120px] bg-gradient-to-r from-purple-500/30 via-blue-500/20 to-pink-500/30" />
      </div>

      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-4xl mx-auto rounded-2xl border border-white/10 bg-surface/50 p-8 md:p-14 backdrop-blur-2xl text-center shadow-[0_0_50px_-10px_rgba(168,85,247,0.15)]"
      >
        <p className={`${systemNumber.label} text-xs uppercase tracking-widest ${textGradient} mb-3`}>
          {text.eyebrow}
        </p>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          {text.title}
        </h2>
        <p className="text-sm md:text-base text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
          {text.desc}
        </p>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10 text-left">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className={`${systemNumber.label} text-[11px] text-purple-400 block mb-1`}>01. ARGS</span>
            <p className="text-xs text-foreground-secondary font-medium">Figma → Xcode</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className={`${systemNumber.label} text-[11px] text-blue-400 block mb-1`}>02. ENGINE</span>
            <p className="text-xs text-foreground-secondary font-medium">Cursor + AI</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className={`${systemNumber.label} text-[11px] text-pink-400 block mb-1`}>03. LOGIC</span>
            <p className="text-xs text-foreground-secondary font-medium">Claude / GPT-4o</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className={`${systemNumber.label} text-[11px] text-cyan-400 block mb-1`}>04. FUNNEL</span>
            <p className="text-xs text-foreground-secondary font-medium">Conversion Flow</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
