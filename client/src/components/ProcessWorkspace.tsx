import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import { useState, useRef, useEffect, useMemo } from "react";
import { Upload, Trash2, Download } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ArtifactPlaceholder from "./ArtifactPlaceholder";
import { systemNumber, systemTag, textGradient, progressGradient } from "@/lib/systemUi";
import { useArtifactAdmin } from "@/lib/artifactAdmin";
import { getProcessPreview, processArtifactImages } from "@/lib/staticArtifacts";
import { publishProcessArtifact } from "@/lib/artifactExport";

const INACTIVE = "#62626a";
const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };
const STORAGE_KEY = "viktor.processArtifacts";

type ArtifactMap = Record<string, string>; // `${stageIndex}:${artifactIndex}` → dataURL

function loadMap(): ArtifactMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveMap(data: ArtifactMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function artifactKey(stageIndex: number, artifactIndex: number) {
  return `${stageIndex}:${artifactIndex}`;
}

export default function ProcessWorkspace() {
  const { language } = useLanguage();
  const processContent = content[language].process;
  const isAdmin = useArtifactAdmin();
  const stages = useMemo(
    () => Object.values(processContent.stages) as Array<{
      title: string;
      description: string;
      artifacts: string[];
      logic: string;
    }>,
    [processContent.stages]
  );

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [activeArtifact, setActiveArtifact] = useState(0);
  const [inView, setInView] = useState(false);
  const [previews, setPreviews] = useState<ArtifactMap>({});
  const ref = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentStage = stages[currentStageIndex];

  useEffect(() => {
    setPreviews(loadMap());
  }, []);

  useEffect(() => {
    setActiveArtifact(0);
  }, [currentStageIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Hero Quick Links → jump to stage
  useEffect(() => {
    const onGotoStage = (event: Event) => {
      const custom = event as CustomEvent<{ stageIndex?: number }>;
      const next = custom.detail?.stageIndex;
      if (typeof next === "number" && next >= 0 && next < stages.length) {
        window.setTimeout(() => {
          setCurrentStageIndex(next);
          setActiveArtifact(0);
        }, 350);
      }
    };
    window.addEventListener("process:goto-stage", onGotoStage);
    return () => window.removeEventListener("process:goto-stage", onGotoStage);
  }, [stages.length]);

  if (!currentStage) return null;

  const previewKey = artifactKey(currentStageIndex, activeArtifact);
  const localPreview = previews[previewKey];
  const currentPreview = getProcessPreview(previewKey, localPreview, isAdmin);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviews((prev) => {
        const next = { ...prev, [previewKey]: dataUrl };
        saveMap(next);
        return next;
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemove = () => {
    setPreviews((prev) => {
      const next = { ...prev };
      delete next[previewKey];
      saveMap(next);
      return next;
    });
  };

  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);

  const isDraft =
    isAdmin && Boolean(localPreview) && !processArtifactImages[previewKey];

  const handleExport = async () => {
    if (!localPreview || exporting) return;
    setExporting(true);
    setExportMsg(null);
    try {
      const result = await publishProcessArtifact(previewKey, localPreview);
      setExportMsg(
        `Сохранено в репо: ${result.publicPath ?? ""}\n\nДальше: git add + commit + push — и на проде увидят все.`
      );
    } catch (e) {
      setExportMsg(
        e instanceof Error
          ? `Не вышло: ${e.message}\n\nНужен localhost (pnpm dev), не прод.`
          : "Ошибка экспорта"
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <section
      id="process"
      ref={ref}
      className="min-h-screen flex flex-col py-16 md:py-24 px-4 bg-background"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto"
      >
        <SectionHeader
          number={3}
          title={processContent.title}
          subtitle={processContent.subtitle}
        />

        {/* Monolithic dashboard shell */}
        <div className="rounded-2xl border border-border/60 bg-surface/40 backdrop-blur-md overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="flex flex-col lg:flex-row min-h-[560px] lg:min-h-[640px]">
            {/* LEFT — stage navigation (1/3) */}
            <aside className="lg:w-1/3 lg:max-w-sm border-b lg:border-b-0 lg:border-r border-border/50 bg-background/40">
              <div className="px-4 pt-4 pb-2 lg:px-5 lg:pt-6">
                <p className={`${systemNumber.label} text-[10px] text-foreground-muted/70 mb-3 lg:mb-4`}>
                  Stages
                </p>
              </div>

              <LayoutGroup>
                <nav
                  className="flex flex-row lg:flex-col gap-1.5 px-3 pb-4 lg:px-3 lg:pb-6 overflow-x-auto lg:overflow-x-visible scrollbar-thin"
                  aria-label="Process stages"
                >
                  {stages.map((stage, index) => {
                    const isActive = index === currentStageIndex;

                    return (
                      <button
                        key={stage.title}
                        type="button"
                        onClick={() => setCurrentStageIndex(index)}
                        className="relative flex-shrink-0 lg:w-full text-left px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-xl transition-colors duration-300 ease-in-out"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="processActiveStage"
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border border-purple-400/25"
                            transition={SPRING}
                          />
                        )}
                        <span
                          className={`relative z-10 text-sm lg:text-[15px] font-medium whitespace-nowrap lg:whitespace-normal transition-colors duration-300 ${
                            isActive ? "text-foreground" : ""
                          }`}
                          style={{ color: isActive ? undefined : INACTIVE }}
                        >
                          <span className={`${systemNumber.label} ${isActive ? textGradient : ""}`}>
                            {String(index + 1).padStart(2, "0")}.
                          </span>{" "}
                          {stage.title}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </LayoutGroup>
            </aside>

            {/* RIGHT — artifacts screen (2/3) */}
            <div className="flex-1 flex flex-col min-w-0 p-5 md:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`stage-${currentStageIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="flex flex-col flex-1 min-h-0"
                >
                  {/* Stage header */}
                  <div className="mb-6 md:mb-8">
                    <p className={`${systemNumber.label} text-sm mb-3 ${textGradient}`}>
                      {String(currentStageIndex + 1).padStart(2, "0")} /{" "}
                      {String(stages.length).padStart(2, "0")}
                    </p>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-3">
                      {currentStage.title}
                    </h3>
                    <p className="text-sm md:text-base text-foreground-secondary leading-relaxed max-w-2xl">
                      {currentStage.description}
                    </p>
                  </div>

                  {/* ARTIFACTS tabs */}
                  <div className="mb-4 md:mb-5">
                    <p className={`${systemNumber.label} text-[10px] md:text-xs mb-3 text-foreground-muted`}>
                      Artefacts
                    </p>

                    <LayoutGroup id="artifact-tabs">
                      <div className="flex flex-wrap gap-2">
                        {currentStage.artifacts.map((artifact, index) => {
                          const isActive = index === activeArtifact;
                          return (
                            <button
                              key={artifact}
                              type="button"
                              onClick={() => setActiveArtifact(index)}
                              className={`relative ${systemTag.base} ${
                                isActive ? systemTag.active : systemTag.idle
                              }`}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="processActiveArtifact"
                                  className={`absolute inset-0 rounded-full opacity-40 ${progressGradient}`}
                                  transition={SPRING}
                                />
                              )}
                              <span className="relative z-10">{artifact}</span>
                            </button>
                          );
                        })}
                      </div>
                    </LayoutGroup>
                  </div>

                  {/* Viewport */}
                  <div className="relative flex-1 min-h-[240px] md:min-h-[320px] rounded-xl border border-border/70 bg-background/50 backdrop-blur-xl overflow-hidden group">
                    <AnimatePresence mode="wait">
                      {currentPreview ? (
                        <motion.div
                          key={previewKey + "-img"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="absolute inset-0"
                        >
                          <img
                            src={currentPreview}
                            alt={currentStage.artifacts[activeArtifact]}
                            className="w-full h-full object-contain md:object-cover bg-black/20"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isAdmin && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => fileRef.current?.click()}
                                  className="p-2 rounded-full bg-black/55 text-white hover:bg-black/75 backdrop-blur-sm"
                                  title="Replace"
                                >
                                  <Upload className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={handleRemove}
                                  className="p-2 rounded-full bg-black/55 text-white hover:bg-white/20 backdrop-blur-sm"
                                  title="Remove"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ) : isAdmin ? (
                        <motion.label
                          key={previewKey + "-empty"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="w-12 h-12 rounded-full border border-border/60 flex items-center justify-center bg-white/[0.03] backdrop-blur-sm">
                            <Upload className="w-5 h-5" style={{ color: INACTIVE }} />
                          </div>
                          <div className="text-center px-4">
                            <p className="text-sm font-medium text-foreground-secondary">
                              Upload artifact
                            </p>
                            <p className="text-xs mt-1" style={{ color: INACTIVE }}>
                              {currentStage.artifacts[activeArtifact]}
                            </p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            className="hidden"
                          />
                        </motion.label>
                      ) : (
                        <motion.div
                          key={previewKey + "-placeholder"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0"
                        >
                          <ArtifactPlaceholder
                            title={processContent.artifactPlaceholderTitle ?? "Artifact coming soon"}
                            hint={processContent.artifactPlaceholderHint}
                            artifactName={currentStage.artifacts[activeArtifact]}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {isAdmin && (
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                      />
                    )}

                    {/* Soft glass edge */}
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.04]" />
                  </div>

                  {isDraft && (
                    <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3 md:p-4">
                      <p className="text-xs leading-relaxed text-emerald-100/85">
                        Черновик в браузере. Нажми экспорт — файл сам ляжет в{" "}
                        <span className="font-medium text-emerald-50">
                          public/artifacts
                        </span>{" "}
                        и пропишется в коде. Потом только git push.
                      </p>
                      <button
                        type="button"
                        onClick={handleExport}
                        disabled={exporting}
                        className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-50 transition-colors hover:bg-emerald-400/20 disabled:opacity-50"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {exporting ? "Сохраняю…" : "Экспорт в репозиторий"}
                      </button>
                      {exportMsg && (
                        <p className="mt-2 whitespace-pre-line text-[11px] leading-relaxed text-emerald-100/70">
                          {exportMsg}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Logic strip — compact, not a duplicate quote */}
                  {currentStage.logic && (
                    <p className={`mt-4 text-xs md:text-sm ${systemNumber.meta} tracking-wide text-foreground-muted`}>
                      {currentStage.logic}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
