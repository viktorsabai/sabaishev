import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ChevronRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";
import { systemTag, systemNumber, textGradient, systemTagTone, systemColorTag } from "@/lib/systemUi";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 28 };
const EASE = { duration: 0.32, ease: [0.23, 1, 0.32, 1] as const };

const CARD_TONES = [
  "border-border hover:border-purple-400/30 bg-surface/80 hover:bg-surface",
  "border-border hover:border-pink-400/25 bg-surface/70 hover:bg-surface",
  "border-border hover:border-blue-400/25 bg-surface/80 hover:bg-surface",
  "border-border hover:border-purple-400/20 bg-surface/60 hover:bg-surface",
];

type CompanyPosition = {
  role?: string;
  period?: string;
  details: string;
  highlights?: string[];
  tags?: string[];
};

type CompanyMeta = {
  role?: string;
  period?: string;
};

function getCompanyMeta(
  company: {
    role?: string;
    period?: string;
    relevantSkills?: string[];
    positions?: Record<string, CompanyPosition>;
  } | null
): CompanyMeta {
  if (!company) return {};
  if (company.role) {
    return { role: company.role, period: company.period };
  }
  const firstSkillId = company.relevantSkills?.[0];
  const firstPosition = firstSkillId ? company.positions?.[firstSkillId] : null;
  return {
    role: firstPosition?.role,
    period: firstPosition?.period,
  };
}

function getCompanyPosition(
  company: { positions?: Record<string, CompanyPosition> } | null,
  skillId: string
): CompanyPosition | null {
  return company?.positions?.[skillId] ?? null;
}

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

  const selectedSkill = selectedDetailId
    ? allSkills.find((i: { id: string }) => i.id === selectedDetailId)
    : null;
  const selectedPosition = selectedSkill
    ? getCompanyPosition(selectedCompany, selectedSkill.id)
    : null;
  const companyMeta = getCompanyMeta(selectedCompany);
  const openDetailLabel =
    language === "ru"
      ? "Подробнее"
      : language === "en"
        ? "Learn more"
        : "เพิ่มเติม";

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

          {/* TIMELINE */}
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

            {/* Company context — short, about the company */}
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
                    <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p
                        className={`text-[11px] ${systemNumber.label} ${textGradient}`}
                      >
                        {selectedCompany.title}
                      </p>
                      {companyMeta.period && (
                        <span className="text-[11px] text-foreground-muted tabular-nums">
                          {companyMeta.period}
                        </span>
                      )}
                    </div>
                    {companyMeta.role && (
                      <p className="mb-3 text-base font-semibold leading-snug text-foreground md:text-[17px]">
                        {companyMeta.role}
                      </p>
                    )}
                    <p className="text-sm md:text-[15px] leading-relaxed text-foreground-secondary text-left">
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

          {/* SKILL BLOCKS — same card format as Stack & Capabilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              layout
              className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {visibleBlocks.map((skill: any, idx: number) => {
                  const position = getCompanyPosition(selectedCompany, skill.id);
                  const achievementTags =
                    position?.tags ??
                    position?.highlights?.slice(0, 3) ??
                    [];

                  return (
                    <motion.article
                      key={`${selectedCompany?.id ?? "all"}-${skill.id}`}
                      layout
                      initial={{ opacity: 0, y: 18 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { ...EASE, delay: idx * 0.06 },
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                        transition: { duration: 0.2 },
                      }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ layout: SPRING, type: "spring", stiffness: 320, damping: 28 }}
                      onClick={() => setSelectedDetailId(skill.id)}
                      className={`group relative flex min-h-[280px] cursor-pointer flex-col overflow-hidden rounded-2xl border p-6 transition-colors duration-300 md:min-h-[320px] md:rounded-3xl md:p-8 ${CARD_TONES[idx % CARD_TONES.length]}`}
                    >
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="relative z-10 flex h-full flex-col">
                        <span
                          className={`${systemNumber.label} mb-4 text-xs ${textGradient}`}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>

                        <h3 className="mb-1.5 text-xl font-bold tracking-tight text-foreground md:text-2xl">
                          {skill.title}
                        </h3>
                        <p className="mb-5 text-sm text-foreground-muted md:mb-6">
                          {skill.description}
                        </p>

                        <p className="flex-1 text-sm leading-relaxed text-foreground-secondary md:text-[15px]">
                          {position?.details ?? skill.details ?? skill.description}
                        </p>

                        {achievementTags.length > 0 && (
                          <div className="mt-6 flex flex-wrap gap-2 md:mt-8">
                            {achievementTags.map((tag: string, tagIdx: number) => (
                              <span key={tag} className={systemColorTag(tagIdx)}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:opacity-90">
                          {openDetailLabel}
                          <span className={`${textGradient} text-base leading-none`}>
                            →
                          </span>
                        </span>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {selectedSkill && (
              <SkillDetailModal
                skill={selectedSkill}
                company={selectedCompany?.title}
                companyMeta={companyMeta}
                position={selectedPosition}
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
  companyMeta,
  position,
  onClose,
  language,
}: {
  skill: any;
  company?: string;
  companyMeta: CompanyMeta;
  position: CompanyPosition | null;
  onClose: () => void;
  language: string;
}) {
  useBodyScrollLock(true);
  const highlights = position?.highlights ?? skill.highlights ?? [];

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
                  {companyMeta.period ? ` · ${companyMeta.period}` : ""}
                </p>
              )}
              {companyMeta.role && (
                <p className="mt-2 text-sm font-medium text-foreground-secondary">
                  {companyMeta.role}
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
            {position?.details ?? skill.details ?? skill.description}
          </p>
          {highlights.length > 0 && (
            <div className="rounded-xl border border-border bg-foreground/[0.03] p-4 md:p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
                {language === "ru"
                  ? "Задачи и результаты"
                  : language === "en"
                    ? "Scope & results"
                    : "ขอบเขตและผลลัพธ์"}
              </p>
              <ul className="space-y-2">
                {highlights.map((line: string) => (
                  <li
                    key={line}
                    className="flex gap-2 text-sm leading-relaxed text-foreground-secondary"
                  >
                    <span className="shrink-0 text-purple-400/80">·</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
