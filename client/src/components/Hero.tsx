import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import HeroMarquee from "./HeroMarquee";

interface HeroProps {
  onExploreClick: () => void;
  onContactClick: () => void;
}

export default function Hero({ onExploreClick, onContactClick }: HeroProps) {
  const { language } = useLanguage();
  const hero = content[language].hero;
  const quickLinks =
    hero.quickLinks ?? hero.tags.map((tag: string) => ({ label: tag, stage: 3 }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.25,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55 },
    },
  };

  const handleQuickLink = (stage: number) => {
    const processEl = document.getElementById("process");
    processEl?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.dispatchEvent(
      new CustomEvent("process:goto-stage", {
        detail: { stageIndex: Math.max(0, stage - 1) },
      })
    );
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100dvh-4rem)] flex-col justify-center overflow-hidden px-4 pb-16 pt-6 md:min-h-screen md:items-center md:justify-center md:pb-0 md:pt-0"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-[18%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-45 blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(59,130,246,0.09) 42%, transparent 70%)",
          }}
        />
        <div
          className="absolute -left-24 top-1/3 h-72 w-72 rounded-full opacity-35 blur-[80px]"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full opacity-30 blur-[90px]"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.16) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,15,18,0.35)_70%,rgba(15,15,18,0.85)_100%)]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:mb-10 md:text-display-md lg:mb-12 lg:text-display-lg"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-foreground-secondary sm:text-base md:mb-12 md:text-lg lg:text-xl"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div variants={itemVariants}>
          <HeroMarquee links={quickLinks} onLinkTap={handleQuickLink} />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col justify-center gap-3 sm:flex-row md:gap-4"
        >
          <motion.button
            onClick={onExploreClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition-all hover:shadow-[0_8px_30px_-8px_rgba(244,241,234,0.35)] md:px-9 md:py-4 md:text-base"
          >
            {hero.cta.explore}
          </motion.button>
          <motion.button
            onClick={onContactClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-foreground/40 px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-foreground hover:bg-foreground/5 md:px-9 md:py-4 md:text-base"
          >
            {hero.cta.contact}
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-foreground-muted"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
}
