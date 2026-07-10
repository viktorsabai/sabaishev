import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Download,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";
import ArtifactPlaceholder from "./ArtifactPlaceholder";
import { systemTag, systemNumber, textGradient } from "@/lib/systemUi";
import { useArtifactAdmin } from "@/lib/artifactAdmin";
import {
  getStackImages,
  stackArtifactImages,
} from "@/lib/staticArtifacts";
import { publishStackArtifacts } from "@/lib/artifactExport";

const STACK_ARTIFACTS_KEY = "viktor.stackArtifacts";

const CARD_TONES = [
  "border-border hover:border-purple-400/30 bg-surface/80 hover:bg-surface",
  "border-border hover:border-pink-400/25 bg-surface/70 hover:bg-surface",
  "border-border hover:border-blue-400/25 bg-surface/80 hover:bg-surface",
  "border-border hover:border-purple-400/20 bg-surface/60 hover:bg-surface",
];

function loadStackArtifacts(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(STACK_ARTIFACTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStackArtifacts(data: Record<string, string[]>) {
  try {
    localStorage.setItem(STACK_ARTIFACTS_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export default function StackCapabilities() {
  const { language } = useLanguage();
  const stack = content[language].stackCapabilities;
  const isAdmin = useArtifactAdmin();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [artifacts, setArtifacts] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setArtifacts(loadStackArtifacts());
  }, []);

  const selected = selectedId
    ? stack.cards.find((c: { id: string }) => c.id === selectedId)
    : null;

  const updateArtifacts = (cardId: string, images: string[]) => {
    setArtifacts((prev) => {
      const next = { ...prev, [cardId]: images };
      saveStackArtifacts(next);
      return next;
    });
  };

  return (
    <ScrollReveal type="reveal" duration={0.8}>
      <section
        id="stack"
        className="flex min-h-screen items-center justify-center px-4 py-20"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
          className="w-full max-w-7xl"
        >
          <SectionHeader
            number={1}
            title={stack.title}
            subtitle={stack.subtitle}
          />

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
          >
            {stack.cards.map((card: any, index: number) => (
              <motion.article
                key={card.id}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
                  },
                }}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                onClick={() => setSelectedId(card.id)}
                className={`group relative flex min-h-[280px] cursor-pointer flex-col overflow-hidden rounded-2xl border p-6 transition-colors duration-300 md:min-h-[320px] md:rounded-3xl md:p-8 ${CARD_TONES[index % CARD_TONES.length]}`}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10 flex h-full flex-col">
                  <span
                    className={`${systemNumber.label} mb-4 text-xs ${textGradient}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mb-1.5 text-xl font-bold tracking-tight text-foreground md:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mb-5 text-sm text-foreground-muted md:mb-6">
                    {card.subtitle}
                  </p>

                  <p className="flex-1 text-sm leading-relaxed text-foreground-secondary md:text-[15px]">
                    {card.description}
                  </p>

                  {card.tags?.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2 md:mt-8">
                      {card.tags.slice(0, 4).map((tag: string, i: number) => (
                        <span
                          key={tag}
                          className={`${systemTag.base} ${
                            i === 0 ? systemTag.active : systemTag.idle
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:opacity-90">
                    {stack.openCase ?? "Смотреть пруф"}
                    <span className={`${textGradient} text-base leading-none`}>
                      →
                    </span>
                  </span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {selected && (
            <StackCardModal
              card={selected}
              index={stack.cards.findIndex(
                (c: { id: string }) => c.id === selected.id
              )}
              labels={stack}
              images={getStackImages(
                selected.id,
                artifacts[selected.id] ?? [],
                isAdmin
              )}
              localImages={artifacts[selected.id] ?? []}
              isAdmin={isAdmin}
              onImagesChange={(images) => updateArtifacts(selected.id, images)}
              onClose={() => setSelectedId(null)}
            />
          )}
        </AnimatePresence>
      </section>
    </ScrollReveal>
  );
}

function StackCardModal({
  card,
  index,
  labels,
  images,
  localImages,
  isAdmin,
  onImagesChange,
  onClose,
}: {
  card: any;
  index: number;
  labels: any;
  images: string[];
  localImages: string[];
  isAdmin: boolean;
  onImagesChange: (images: string[]) => void;
  onClose: () => void;
}) {
  const [slide, setSlide] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isDraft =
    isAdmin &&
    localImages.length > 0 &&
    !(stackArtifactImages[card.id]?.length);

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
      await publishStackArtifacts(card.id, localImages);
      setExportMsg(
        "Сохранено в public/artifacts/stack и staticArtifacts.ts.\nДальше: git push."
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
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/90 p-6 backdrop-blur-sm md:p-8">
          <div>
            <div
              className={`${systemNumber.label} mb-2 text-[11px] md:text-xs ${textGradient}`}
            >
              CAPABILITY {String(index + 1).padStart(2, "0")}
            </div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              {card.title}
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">{card.subtitle}</p>
          </div>
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-full p-2 transition-all hover:bg-accent/20"
          >
            <X className="h-6 w-6 text-foreground" />
          </motion.button>
        </div>

        <div className="space-y-6 p-6 md:p-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
                {labels.artifactsLabel ?? "Proof"}
              </p>
              {images.length > 0 && (
                <span className={`${systemNumber.meta} text-xs ${textGradient}`}>
                  {slide + 1} / {images.length}
                </span>
              )}
            </div>

            <div className="group relative h-56 overflow-hidden rounded-xl border border-dashed border-border bg-background md:h-72">
              {images.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${card.id}-${slide}`}
                      src={images[slide]}
                      alt={`${card.title} proof ${slide + 1}`}
                      className="h-full w-full object-contain"
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
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSlide((s) => (s + 1) % images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={removeCurrent}
                        className="rounded-full bg-black/50 p-2 text-white hover:bg-white/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : isAdmin ? (
                <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-3 hover:bg-foreground/[0.02]">
                  <Upload className="h-8 w-8 text-foreground-muted" />
                  <p className="text-sm text-foreground-muted">
                    {labels.uploadHint}
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
                  title={labels.artifactPlaceholderTitle}
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
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={exporting}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-50 hover:bg-emerald-400/20 disabled:opacity-50"
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

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
              PROOF
            </p>
            <p className="text-base leading-relaxed text-foreground-secondary">
              {card.proof ?? card.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {card.tags?.map((tag: string, i: number) => (
              <span
                key={tag}
                className={`${systemTag.base} ${
                  i === 0 ? systemTag.active : systemTag.idle
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
