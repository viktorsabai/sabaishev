import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";
import { systemTag, systemNumber, textGradient } from "@/lib/systemUi";

const CARD_TONES = [
  {
    shell: "bg-surface/80 hover:bg-surface",
    border: "border-border hover:border-foreground/20",
  },
  {
    shell: "bg-surface/70 hover:bg-surface",
    border: "border-border hover:border-foreground/20",
  },
  {
    shell: "bg-surface/80 hover:bg-surface",
    border: "border-border hover:border-foreground/25",
  },
  {
    shell: "bg-surface/60 hover:bg-surface",
    border: "border-border hover:border-foreground/20",
  },
];

export default function StackCapabilities() {
  const { language } = useLanguage();
  const stack = content[language].stackCapabilities;

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] as const },
    },
  };

  return (
    <ScrollReveal type="reveal" duration={0.8}>
      <section
        id="stack"
        className="min-h-screen flex items-center justify-center py-20 px-4"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="w-full max-w-7xl"
        >
          <SectionHeader
            number={1}
            title={stack.title}
            subtitle={stack.subtitle}
          />

          {/* Bento Grid */}
          <motion.div
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
          >
            {stack.cards.map((card: any, index: number) => {
              const tone = CARD_TONES[index % CARD_TONES.length];

              return (
                <motion.article
                  key={card.id}
                  variants={item}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className={`group relative flex flex-col rounded-2xl md:rounded-3xl border p-6 md:p-8 min-h-[280px] md:min-h-[320px] overflow-hidden transition-colors duration-300 ${tone.shell} ${tone.border}`}
                >
                  {/* Soft inner highlight on hover */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />

                  <div className="relative z-10 flex flex-col h-full">
                    <span
                      className={`${systemNumber.label} text-xs mb-4 ${textGradient}`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight mb-1.5">
                      {card.title}
                    </h3>
                    <p className="text-sm text-foreground-muted mb-5 md:mb-6">
                      {card.subtitle}
                    </p>

                    <p className="text-sm md:text-[15px] text-foreground-secondary leading-relaxed flex-1">
                      {card.description}
                    </p>

                    {card.tags?.length > 0 && (
                      <div className="mt-6 md:mt-8 flex flex-wrap gap-2">
                        {card.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className={`${systemTag.base} ${systemTag.idle}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.div>
      </section>
    </ScrollReveal>
  );
}
