import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import { useEffect, useRef, useState } from "react";
import {
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Trash2,
  Activity,
  CircleDot,
  Sparkles,
  Download,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";
import ArtifactPlaceholder from "./ArtifactPlaceholder";
import { progressGradient, systemTag, systemNumber, textGradient } from "@/lib/systemUi";
import { useArtifactAdmin } from "@/lib/artifactAdmin";
import { getProductImages, productArtifactImages } from "@/lib/staticArtifacts";
import { publishProductArtifacts } from "@/lib/artifactExport";

function getStatusMeta(status: string) {
  const s = status.toLowerCase();
  const isLive =
    s.includes("shipped") ||
    s.includes("live") ||
    s.includes("запущен") ||
    s.includes("เปิดตัว");
  const isActive =
    s.includes("progress") ||
    s.includes("mvp") ||
    s.includes("prototype") ||
    s.includes("работе") ||
    s.includes("прототип") ||
    s.includes("эксперимент") ||
    s.includes("концепт") ||
    s.includes("concept") ||
    s.includes("กำลังพัฒนา") ||
    s.includes("ต้นแบบ") ||
    s.includes("ทดลอง") ||
    s.includes("แนวคิด");

  // Icons must NOT use text-system-gradient (background-clip makes SVG strokes invisible)
  if (isLive) {
    return {
      Icon: Sparkles,
      className: "border-white/18 bg-white/[0.06] text-foreground",
      iconClass: "text-pink-400",
    };
  }
  if (isActive) {
    return {
      Icon: Activity,
      className: "border-white/14 bg-white/[0.05] text-foreground",
      iconClass: "text-purple-400",
    };
  }
  return {
    Icon: CircleDot,
    className: "border-white/12 bg-white/[0.04] text-foreground-secondary",
    iconClass: "text-foreground-muted",
  };
}

function AnimatedProgress({
  value,
  label = "Progress",
}: {
  value: number;
  label?: string;
}) {
  const [display, setDisplay] = useState(0);
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    setWidth(value);
    let start: number | null = null;
    let frame = 0;
    const duration = 900;
    const tick = (t: number) => {
      if (start == null) start = t;
      const p = Math.min((t - start) / duration, 1);
      setDisplay(Math.round(p * value));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, value]);

  return (
    <div ref={ref} className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <span className="pb-1.5 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">
          {label}
        </span>
        <span
          className={`${systemNumber.display} ${textGradient} text-4xl md:text-5xl leading-none tracking-[-0.04em]`}
        >
          {display}
          <span className="ml-0.5 text-[0.42em] font-semibold opacity-80 align-super">
            %
          </span>
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${progressGradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>
    </div>
  );
}

const ARTIFACTS_KEY = "viktor.productArtifacts";

function loadArtifacts(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(ARTIFACTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveArtifacts(data: Record<string, string[]>) {
  try {
    localStorage.setItem(ARTIFACTS_KEY, JSON.stringify(data));
  } catch {
    /* quota / private mode */
  }
}

export default function ProductModules() {
  const { language } = useLanguage();
  const productModules = content[language].productModules;
  const isAdmin = useArtifactAdmin();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [artifacts, setArtifacts] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setArtifacts(loadArtifacts());
  }, []);

  const updateArtifacts = (productId: string, images: string[]) => {
    setArtifacts((prev) => {
      const next = { ...prev, [productId]: images };
      saveArtifacts(next);
      return next;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const selected = selectedProduct
    ? productModules.products.find((p: { id: string }) => p.id === selectedProduct)
    : null;

  return (
    <ScrollReveal type="build" duration={0.8}>
      <section id="products" className="min-h-screen py-20 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <SectionHeader number={2} title={productModules.title} />

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {productModules.products.map((product: any) => {
              const statusMeta = getStatusMeta(product.status);
              const StatusIcon = statusMeta.Icon;
              const preview =
                product.cardDescription ?? product.description;

              return (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.01 }}
                  onClick={() => setSelectedProduct(product.id)}
                  className="relative p-6 md:p-8 bg-surface/50 backdrop-blur-sm border border-border rounded-2xl cursor-pointer transition-all duration-300 hover:bg-surface hover:shadow-lg hover:shadow-foreground/5 hover:border-white/18 group"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div
                      className={`${systemNumber.label} text-[11px] md:text-xs ${textGradient}`}
                    >
                      MODULE {product.number}
                    </div>

                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusMeta.className}`}
                    >
                      <StatusIcon
                        className={`w-3.5 h-3.5 shrink-0 ${statusMeta.iconClass}`}
                        strokeWidth={2}
                      />
                      <span className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap leading-none">
                        {product.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-heading-md md:text-heading-lg font-bold text-foreground mb-2">
                    {product.name}
                  </h3>

                  <p className="text-body-sm text-foreground-secondary mb-5">
                    {product.type}
                  </p>

                  <div className="mb-5">
                    <AnimatedProgress
                      value={product.progress ?? 0}
                      label={productModules.progressLabel ?? "Progress"}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className={`${systemTag.base} ${systemTag.idle}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-foreground-secondary leading-relaxed min-h-[3.5rem]">
                    {preview}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-foreground group-hover:opacity-90 transition-opacity inline-flex items-center gap-1.5">
                      {productModules.openCase ?? "Open case"}
                      <span className={`${textGradient} text-base leading-none`}>→</span>
                    </span>
                    {product.link && (
                      <span className="inline-flex items-center gap-1 text-xs text-foreground-muted">
                        <ExternalLink className="w-3.5 h-3.5" />
                        live
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {selected && (
            <ProductDetailModal
              product={selected}
              labels={productModules}
              images={getProductImages(
                selected.id,
                artifacts[selected.id] ?? [],
                isAdmin
              )}
              localImages={artifacts[selected.id] ?? []}
              isAdmin={isAdmin}
              onImagesChange={(images) => updateArtifacts(selected.id, images)}
              onClose={() => setSelectedProduct(null)}
            />
          )}
        </AnimatePresence>
      </section>
    </ScrollReveal>
  );
}

function ProductDetailModal({
  product,
  labels,
  images,
  localImages,
  isAdmin,
  onImagesChange,
  onClose,
}: {
  product: any;
  labels: any;
  images: string[];
  localImages: string[];
  isAdmin: boolean;
  onImagesChange: (images: string[]) => void;
  onClose: () => void;
}) {
  const statusMeta = getStatusMeta(product.status);
  const StatusIcon = statusMeta.Icon;
  const [slide, setSlide] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isDraft =
    isAdmin &&
    localImages.length > 0 &&
    !(productArtifactImages[product.id]?.length);

  useEffect(() => {
    setSlide(0);
  }, [product.id]);

  useEffect(() => {
    if (slide >= images.length && images.length > 0) {
      setSlide(images.length - 1);
    }
  }, [images.length, slide]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    ).then((results) => {
      onImagesChange([...localImages, ...results]);
      setSlide(localImages.length);
    });

    e.target.value = "";
  };

  const removeCurrent = () => {
    const next = localImages.filter((_, i) => i !== slide);
    onImagesChange(next);
    setSlide((s) => Math.max(0, Math.min(s, next.length - 1)));
  };

  const handlePublish = async () => {
    if (!localImages.length || exporting) return;
    setExporting(true);
    setExportMsg(null);
    try {
      await publishProductArtifacts(product.id, localImages);
      setExportMsg(
        "Сохранено в public/artifacts и staticArtifacts.ts.\nДальше: git push — и на проде увидят все."
      );
    } catch (e) {
      setExportMsg(
        e instanceof Error
          ? `Не вышло: ${e.message}\nНужен localhost (pnpm dev).`
          : "Ошибка экспорта"
      );
    } finally {
      setExporting(false);
    }
  };

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
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 md:p-8 border-b border-border bg-surface/90 backdrop-blur-sm">
          <div>
            <div
              className={`${systemNumber.label} text-[11px] md:text-xs mb-2 ${textGradient}`}
            >
              MODULE {product.number}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {product.name}
            </h2>
          </div>
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-accent/20 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-foreground" />
          </motion.button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div>
            <p className="text-sm text-foreground-muted mb-2 font-semibold uppercase tracking-wide">
              TYPE
            </p>
            <p className="text-lg text-foreground mb-4">{product.type}</p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border w-fit ${statusMeta.className}`}
              >
                <StatusIcon
                  className={`w-3.5 h-3.5 shrink-0 ${statusMeta.iconClass}`}
                  strokeWidth={2}
                />
                <span className="text-[11px] font-semibold uppercase tracking-wide leading-none">
                  {product.status}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <AnimatedProgress
                  value={product.progress ?? 0}
                  label={labels.progressLabel ?? "Progress"}
                />
              </div>
            </div>
          </div>

          {/* Multi-image artifact gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground-muted font-semibold uppercase tracking-wide">
                {labels.artifactsLabel ?? "Artifacts"}
              </p>
              {images.length > 0 && (
                <span className={`${systemNumber.meta} text-xs ${textGradient}`}>
                  {slide + 1} / {images.length}
                </span>
              )}
            </div>

            <div className="relative w-full h-56 md:h-72 bg-background rounded-xl border border-dashed border-border overflow-hidden group">
              {images.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${product.id}-${slide}`}
                      src={images[slide]}
                      alt={`${product.name} artifact ${slide + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    />
                  </AnimatePresence>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setSlide((s) => (s - 1 + images.length) % images.length)
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSlide((s) => (s + 1) % images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSlide(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === slide ? "w-5 bg-white" : "w-1.5 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                          title={labels.uploadMore}
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={removeCurrent}
                          className="p-2 rounded-full bg-black/50 text-white hover:bg-white/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : isAdmin ? (
                <label className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-foreground/[0.02] transition-colors">
                  <Upload className="w-8 h-8 text-foreground-muted" />
                  <p className="text-sm text-foreground-muted">
                    {labels.uploadHint ?? "Upload artifact"}
                  </p>
                  <p className="text-xs text-foreground-muted/60">
                    {labels.uploadFormats ?? "PNG, JPG — multiple files"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <ArtifactPlaceholder
                  title={labels.artifactPlaceholderTitle ?? "Screens coming soon"}
                  hint={labels.artifactPlaceholderHint}
                />
              )}

              {isAdmin && (
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                />
              )}
            </div>

            {isDraft && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3">
                <p className="text-xs leading-relaxed text-emerald-100/85">
                  Черновик в браузере. Экспорт сам положит файлы в репозиторий.
                </p>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={exporting}
                  className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-50 hover:bg-emerald-400/20 disabled:opacity-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  {exporting ? "Сохраняю…" : "Экспорт в репозиторий"}
                </button>
                {exportMsg && (
                  <p className="mt-2 whitespace-pre-line text-[11px] text-emerald-100/70">
                    {exportMsg}
                  </p>
                )}
              </div>
            )}
          </div>

          {product.link && (
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              {labels.visitSite ?? "Visit site"}
            </a>
          )}

          <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
            <p className="text-sm text-foreground-muted mb-2 font-semibold uppercase tracking-wide">
              DESCRIPTION
            </p>
            <p className="text-base text-foreground-secondary leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
            <p className="text-sm text-foreground-muted mb-2 font-semibold uppercase tracking-wide">
              CHALLENGE
            </p>
            <p className="text-base text-foreground-secondary">{product.challenge}</p>
          </div>

          <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
            <p className="text-sm text-foreground-muted mb-2 font-semibold uppercase tracking-wide">
              SOLUTION
            </p>
            <p className="text-base text-foreground-secondary">{product.solution}</p>
          </div>

          <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
            <p className="text-sm text-foreground-muted mb-2 font-semibold uppercase tracking-wide">
              ROLE
            </p>
            <p className="text-base text-foreground-secondary">{product.role}</p>
          </div>

          <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
            <p className="text-sm text-foreground-muted mb-2 font-semibold uppercase tracking-wide">
              STACK
            </p>
            <p className="text-base text-foreground-secondary">{product.stack}</p>
          </div>

          <div>
            <p className="text-sm text-foreground-muted mb-3 font-semibold uppercase tracking-wide">
              TAGS
            </p>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className={`${systemTag.base} ${systemTag.idle}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
