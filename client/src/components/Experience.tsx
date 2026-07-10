import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ChevronRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";
import { systemTag, systemNumber, textGradient, progressGradient, systemTagTone } from "@/lib/systemUi";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 28 };
const EASE = { duration: 0.32, ease: [0.23, 1, 0.32, 1] as const };

export default function Experience() {
  const { language } = useLanguage();
  const experience = content[language].experience;
  const companies = experience.companies ?? [];
  const allSkills = experience.items;

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);

  const selectedCompany = companies[activeIndex] ?? null;
  const relevantSkillIds: string[] = selectedCompany?.relevantSkills ?? [];

  const visibleBlocks = useMemo(() => {
    if (!selectedCompany) return allSkills;
    return allSkills.filter((skill: { id: string }) =>
      relevantSkillIds.includes(skill.id)
    );
  }, [allSkills, selectedCompany, relevantSkillIds]);

  const selectCompany = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setSelectedDetailId(null);
  };

  return (
    <ScrollReveal type="stagger" duration={0.7}>
      <section
        id="experience"
        className="flex items-start justify-start px-4 py-14 md:min-h-screen md:items-center md:justify-center md:py-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-7xl"
        >
          <SectionHeader number={4} title={experience.title} subtitle={experience.intro} />

          {/* TIMELINE — tap only, no scroll hijack */}
          <div className="mb-8 md:mb-12">
            <LayoutGroup>
              <div className="relative grid grid-cols-4 gap-1 px-0 md:gap-4 md:px-8">
                <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[18px] hidden h-px bg-border/50 md:block" />

                {companies.map((company: any, idx: number) => {
                  const isActive = idx === activeIndex;
                  const isPast = idx < activeIndex;

                  return (
                    <div
                      key={company.id}
                      className="relative z-10 flex flex-col items-center"
                    >
                      {idx > 0 && (
                        <ChevronRight
                          className={`pointer-events-none absolute left-0 top-[14px] hidden h-3.5 w-3.5 -translate-x-1/2 md:block ${
                            isPast || isActive
                              ? "text-foreground-muted/60"
                              : "text-foreground-muted/25"
                          }`}
                          strokeWidth={2}
                        />
                      )}

                      <motion.button
                        type="button"
                        onClick={() => selectCompany(idx)}
                        className="flex w-full flex-col items-center gap-2.5 outline-none md:gap-4"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <div className="relative flex h-8 w-8 items-center justify-center overflow-visible md:h-9 md:w-9">
                          {isActive && (
                            <motion.div
                              layoutId="activeTrackIndicator"
                              className="absolute inset-0 rounded-full bg-purple-500/25"
                              transition={SPRING}
                            />
                          )}

                          <motion.span
                            animate={{ scale: isActive ? 1.15 : 1 }}
                            transition={SPRING}
                            className={`relative z-10 h-3 w-3 rounded-full md:h-3.5 md:w-3.5 ${
                              isActive
                                ? "bg-foreground shadow-[0_0_12px_rgba(168,85,247,0.5)] ring-2 ring-purple-400/40"
                                : isPast
                                  ? "bg-purple-400/55"
                                  : "bg-foreground/30"
                            }`}
                          />
                        </div>

                        <motion.span
                          animate={{
                            opacity: isActive ? 1 : 0.55,
                            scale: isActive ? 1.04 : 1,
                          }}
                          transition={EASE}
                          className={`text-center text-[11px] leading-tight md:text-base ${
                            isActive
                              ? "font-bold text-foreground"
                              : "font-medium text-foreground-secondary"
                          }`}
                        >
                          {company.title}
                        </motion.span>
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            </LayoutGroup>

            {/* Company briefing */}
            <div className="mt-10 md:mt-12 min-h-[6.5rem]">
              <AnimatePresence mode="wait">
                {selectedCompany && (
                  <motion.div
                    key={selectedCompany.id}
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="mx-auto max-w-2xl rounded-2xl border border-border/70 bg-surface/70 px-6 py-5 md:px-8 md:py-6"
                  >
                    {selectedCompany.role && (
                      <p className={`mb-2 text-[11px] ${systemNumber.label} ${textGradient}`}>
                        {selectedCompany.role}
                      </p>
                    )}
                    <p className="text-sm md:text-[15px] leading-relaxed text-foreground-secondary text-left md:text-center">
                      {selectedCompany.blurb}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* COMPETENCY TAGS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent mb-10" />

            <LayoutGroup>
              <div className="flex flex-wrap gap-2.5 md:gap-3 justify-center">
                {allSkills.map((skill: any) => {
                  const isRelevant = relevantSkillIds.includes(skill.id);
                  const relevantIndex = isRelevant
                    ? relevantSkillIds.indexOf(skill.id)
                    : 0;

                  return (
                    <motion.button
                      key={skill.id}
                      layout
                      initial={false}
                      animate={{
                        opacity: isRelevant ? 1 : 0.28,
                        scale: isRelevant ? 1 : 0.92,
                      }}
                      transition={{
                        ...EASE,
                        delay: isRelevant ? relevantIndex * 0.04 : 0,
                        layout: SPRING,
                      }}
                      onClick={() => {
                        if (!isRelevant) return;
                        setSelectedDetailId(skill.id);
                      }}
                      whileHover={isRelevant ? { scale: 1.06, y: -2 } : undefined}
                      whileTap={isRelevant ? { scale: 0.96 } : undefined}
                      disabled={!isRelevant}
                      className={`${systemTag.lg} border origin-center ${
                        isRelevant
                          ? systemTagTone(relevantIndex)
                          : `${systemTag.ghostDim} border-white/5`
                      }`}
                    >
                      {skill.title}
                    </motion.button>
                  );
                })}
              </div>
            </LayoutGroup>
          </motion.div>

          {/* SKILL BLOCKS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mt-16"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent mb-12" />

            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {visibleBlocks.map((skill: any, idx: number) => (
                  <motion.div
                    key={skill.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 14 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: { ...EASE, delay: idx * 0.06 },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.92,
                      y: -8,
                      transition: { duration: 0.2 },
                    }}
                    transition={{ layout: SPRING }}
                    onClick={() => setSelectedDetailId(skill.id)}
                    className="group cursor-pointer rounded-2xl border border-border/60 bg-surface/50 p-6 md:p-7 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-purple-400/25 hover:bg-surface hover:shadow-[0_0_40px_-16px_rgba(168,85,247,0.35)]"
                  >
                    <h3 className="text-heading-sm mb-2 font-semibold text-foreground">
                      {skill.title}
                    </h3>
                    <p className="text-body-sm line-clamp-3 text-foreground-secondary">
                      {skill.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-foreground-muted">
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${progressGradient}`} />
                      <span className="opacity-0 transition-opacity group-hover:opacity-100">
                        {language === "ru"
                          ? "Подробнее"
                          : language === "en"
                            ? "Learn more"
                            : "เพิ่มเติม"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {selectedDetailId && (
              <SkillDetailModal
                skill={allSkills.find((i: { id: string }) => i.id === selectedDetailId)!}
                company={selectedCompany?.title}
                onClose={() => setSelectedDetailId(null)}
                language={language}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </ScrollReveal>
  );
}

function SkillDetailModal({
  skill,
  company,
  onClose,
  language,
}: {
  skill: any;
  company?: string;
  onClose: () => void;
  language: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface"
      >
        <div className="sticky top-0 border-b border-border bg-surface/80 p-6 md:p-8 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="mb-1 text-2xl font-bold text-foreground md:text-3xl">
                {skill.title}
              </h2>
              {company && (
                <p className="text-sm text-foreground-muted">
                  {language === "ru"
                    ? "Опыт в"
                    : language === "en"
                      ? "Experience at"
                      : "ประสบการณ์ที่"}{" "}
                  {company}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 transition-all hover:bg-foreground/10"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6 md:p-8">
          <p className="text-body-md leading-relaxed text-foreground-secondary">
            {skill.description}
          </p>
          <div className="rounded-xl border border-border bg-foreground/[0.03] p-4">
            <p className="text-body-md leading-relaxed text-foreground-secondary">
              {skill.details}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
