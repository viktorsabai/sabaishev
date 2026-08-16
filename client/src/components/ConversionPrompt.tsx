import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ConversionPromptProps {
  titleRu: string;
  titleEn: string;
  titleTh: string;
  subtitleRu: string;
  subtitleEn: string;
  subtitleTh: string;
}

export default function ConversionPrompt({
  titleRu,
  titleEn,
  titleTh,
  subtitleRu,
  subtitleEn,
  subtitleTh,
}: ConversionPromptProps) {
  const { language } = useLanguage();
  const copy =
    language === "ru"
      ? { title: titleRu, subtitle: subtitleRu, label: "Следующий шаг", action: "Собрать бриф" }
      : language === "th"
        ? { title: titleTh, subtitle: subtitleTh, label: "ขั้นตอนถัดไป", action: "สร้างบรีฟ" }
        : { title: titleEn, subtitle: subtitleEn, label: "Next step", action: "Build brief" };

  const scrollToBrief = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55 }}
      className="mx-auto my-14 flex max-w-6xl flex-col items-start justify-between gap-5 rounded-2xl border border-border/80 bg-surface/35 px-5 py-6 shadow-xl backdrop-blur-xl sm:px-7 md:my-20 md:flex-row md:items-center md:px-8 md:py-7"
    >
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{copy.label}</p>
        <h3 className="mb-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">{copy.title}</h3>
        <p className="max-w-xl text-sm leading-relaxed text-foreground-secondary">{copy.subtitle}</p>
      </div>
      <motion.button
        type="button"
        onClick={scrollToBrief}
        whileHover={{ scale: 1.025 }}
        whileTap={{ scale: 0.975 }}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-lg transition-shadow hover:shadow-accent/20"
      >
        {copy.action}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </motion.button>
    </motion.div>
  );
}
