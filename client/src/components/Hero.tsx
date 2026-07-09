import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import { systemTag } from "@/lib/systemUi";

interface HeroProps {
  onExploreClick: () => void;
  onContactClick: () => void;
}

const FLOAT_PLANES = [
  { label: "TAIKA", x: "6%", y: "16%", rotate: -10, delay: 0, w: "w-48 md:w-64" },
  { label: "MOO", x: "70%", y: "20%", rotate: 8, delay: 0.12, w: "w-40 md:w-56" },
  { label: "Hospital", x: "10%", y: "64%", rotate: 6, delay: 0.22, w: "w-52 md:w-72" },
  { label: "Farang", x: "66%", y: "60%", rotate: -7, delay: 0.32, w: "w-44 md:w-60" },
];

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
      className="relative min-h-screen flex items-center justify-center pt-20 md:pt-0 px-4 overflow-hidden"
    >
      {/* Soft light field — Apple-like depth */}
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

      {/* Floating product planes — soft screens, not cards */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        {FLOAT_PLANES.map((plane) => (
          <motion.div
            key={plane.label}
            className={`absolute ${plane.w}`}
            style={{ left: plane.x, top: plane.y }}
            initial={{ opacity: 0, y: 28 }}
            animate={{
              opacity: 0.5,
              y: [0, -12, 0],
              rotate: [plane.rotate, plane.rotate + 1.2, plane.rotate],
            }}
            transition={{
              opacity: { duration: 1, delay: 0.35 + plane.delay },
              y: {
                duration: 6 + plane.delay * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: plane.delay,
              },
              rotate: {
                duration: 8 + plane.delay * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: plane.delay,
              },
            }}
          >
            <div className="aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-white/[0.09] via-purple-500/[0.07] to-blue-500/[0.08] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
              <div className="flex h-full flex-col justify-end p-5 md:p-6">
                <p className="text-lg md:text-xl font-semibold tracking-tight text-foreground/55">
                  {plane.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Soft vignette so text stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,15,18,0.5)_58%,rgba(15,15,18,0.92)_100%)]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-5xl mx-auto px-4"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-display-md lg:text-display-lg font-bold text-foreground mb-6 md:mb-10 lg:mb-12 leading-tight tracking-tight"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground-secondary mb-10 md:mb-14 max-w-2xl mx-auto leading-relaxed"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-2.5 md:gap-3 justify-center mb-12 md:mb-16"
        >
          {quickLinks.map(
            (link: { label: string; stage: number }, index: number) => (
              <motion.button
                key={link.label}
                type="button"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.045, 1],
                }}
                transition={{
                  opacity: { delay: 0.45 + index * 0.05, duration: 0.4 },
                  scale: {
                    delay: 0.9 + index * 0.35,
                    duration: 2.8,
                    repeat: Infinity,
                    repeatDelay: 3.2,
                    ease: "easeInOut",
                  },
                }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleQuickLink(link.stage)}
                className={`${systemTag.base} ${systemTag.interactive} shadow-[0_0_0_1px_rgba(255,255,255,0.02)]`}
              >
                {link.label}
              </motion.button>
            )
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
        >
          <motion.button
            onClick={onExploreClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-7 md:px-9 py-3.5 md:py-4 bg-foreground text-background font-semibold rounded-xl text-sm md:text-base transition-all hover:shadow-[0_8px_30px_-8px_rgba(244,241,234,0.35)]"
          >
            {hero.cta.explore}
          </motion.button>
          <motion.button
            onClick={onContactClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-7 md:px-9 py-3.5 md:py-4 border border-foreground/40 text-foreground font-semibold rounded-xl text-sm md:text-base transition-all hover:border-foreground hover:bg-foreground/5"
          >
            {hero.cta.contact}
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground-muted z-10"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
