import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

const PROJECT_COLORS = [
  { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-300", gradient: "from-blue-500 to-blue-600", dot: "bg-blue-400" },
  { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-300", gradient: "from-purple-500 to-purple-600", dot: "bg-purple-400" },
  { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-300", gradient: "from-pink-500 to-pink-600", dot: "bg-pink-400" },
  { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-300", gradient: "from-cyan-500 to-cyan-600", dot: "bg-cyan-400" },
  { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300", gradient: "from-emerald-500 to-emerald-600", dot: "bg-emerald-400" },
];

const getProjectColor = (index: number) => PROJECT_COLORS[index % PROJECT_COLORS.length];

// Animated Number Component
function AnimatedNumber({ value, duration = 2, suffix = "" }: { value: number; duration?: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isVisible, value, duration]);

  return (
    <div ref={ref} className="font-mono font-bold tracking-tight">
      {displayValue}
      {suffix}
    </div>
  );
}

export default function NowBuilding() {
  const { language } = useLanguage();
  const nowBuilding = content[language].nowBuilding;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <ScrollReveal type="morph" duration={0.9}>
      <section id="now-building" className="min-h-screen flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20 md:mb-24"
          >
            <h2 className="text-display-sm md:text-display-md font-bold text-foreground mb-4">
              {nowBuilding.title}
            </h2>
            <p className="text-body-md text-foreground-secondary">
              {nowBuilding.intro}
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="space-y-6">
            {nowBuilding.projects.map((project: any, idx: number) => {
              const color = getProjectColor(idx);
              const isSelected = selectedId === project.id;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  onClick={() => setSelectedId(project.id)}
                  className={`group cursor-pointer transition-all duration-300 ${
                    isSelected ? "ring-2 ring-accent" : ""
                  }`}
                >
                  <div
                    className={`p-6 md:p-8 ${color.bg} backdrop-blur-sm border ${color.border} rounded-2xl hover:shadow-lg hover:shadow-current/10 transition-all duration-300 hover:-translate-y-1`}
                  >
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-heading-md font-semibold text-foreground">
                            {project.name}
                          </h3>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-2 h-2 rounded-full ${color.dot}`}
                          />
                        </div>
                        <p className={`text-caption ${color.text}`}>
                          {project.status}
                        </p>
                      </div>

                      {/* WOW-Effect Percentage */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                        className="ml-6 text-right"
                      >
                        <div className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${color.gradient} bg-clip-text text-transparent drop-shadow-lg`}>
                          <AnimatedNumber value={project.progress} duration={2} suffix="%" />
                        </div>
                        <p className="text-xs text-foreground-muted mt-1">
                          {language === 'ru' ? 'Готово' : language === 'en' ? 'Complete' : 'เสร็จสิ้น'}
                        </p>
                      </motion.div>
                    </div>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 + 0.1, duration: 0.5 }}
                      className="text-body-sm text-foreground-secondary mt-4 line-clamp-2"
                    >
                      {project.description}
                    </motion.p>

                    {/* Progress Bar with Gradient */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                      className={`mt-6 h-2 bg-surface-elevated rounded-full overflow-hidden border ${color.border}`}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${project.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 + 0.3, duration: 1.5, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${color.gradient} shadow-lg shadow-current/50`}
                      />
                    </motion.div>

                    {/* Expand Indicator */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                      className="mt-4 flex items-center gap-2 text-xs text-foreground-muted group-hover:text-accent transition-colors"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-foreground-muted/50 group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/50 transition-all" />
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {language === 'ru' ? 'Подробнее' : language === 'en' ? 'Learn more' : 'เพิ่มเติม'}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

            {/* Detail Modal */}
          {selectedId && (
            <ProjectDetailModal
              project={nowBuilding.projects.find((p: any) => p.id === selectedId)!}
              onClose={() => setSelectedId(null)}
              language={language}
            />
          )}
        </motion.div>
      </section>
    </ScrollReveal>
  );
}

interface ProjectDetailModalProps {
  project: any;
  onClose: () => void;
  language: string;
}

function ProjectDetailModal({ project, onClose, language }: ProjectDetailModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 p-6 md:p-8 border-b border-border bg-surface/80 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {project.name}
              </h2>
              <p className="text-sm text-foreground-muted">
                {project.status}
              </p>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-foreground/10 rounded-full transition-all"
            >
              <X size={20} />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-body-md text-foreground-secondary leading-relaxed">
              {project.description}
            </p>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-foreground/5 border border-foreground/10 rounded-xl"
          >
            <p className="text-body-md text-foreground-secondary leading-relaxed">
              {project.details}
            </p>
          </motion.div>

          {/* Progress Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="p-4 bg-foreground/5 border border-foreground/10 rounded-xl">
              <p className="text-xs text-foreground-muted mb-2">
                {language === 'ru' ? 'Статус' : language === 'en' ? 'Status' : 'สถานะ'}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {project.status}
              </p>
            </div>
            <div className="p-4 bg-foreground/5 border border-foreground/10 rounded-xl">
              <p className="text-xs text-foreground-muted mb-2">
                {language === 'ru' ? 'Готово' : language === 'en' ? 'Complete' : 'เสร็จสิ้น'}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {project.progress}%
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
