import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { systemNumber, systemTag, textGradient } from "@/lib/systemUi";

export type ProcessCarouselItem = {
  name: string;
  src: string;
  tools: string[];
};

interface ProcessArtifactCarouselProps {
  stageNumber: string;
  stageTitle: string;
  items: ProcessCarouselItem[];
  initialIndex: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

export default function ProcessArtifactCarousel({
  stageNumber,
  stageTitle,
  items,
  initialIndex,
  onClose,
  onIndexChange,
}: ProcessArtifactCarouselProps) {
  const [slide, setSlide] = useState(initialIndex);

  useEffect(() => {
    setSlide(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setSlide((s) => (s - 1 + items.length) % items.length);
      }
      if (e.key === "ArrowRight") {
        setSlide((s) => (s + 1) % items.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length, onClose]);

  useEffect(() => {
    onIndexChange?.(slide);
  }, [slide, onIndexChange]);

  if (!items.length) return null;

  const current = items[slide];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-3 backdrop-blur-md md:p-6"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 16 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-surface"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-surface/90 px-5 py-4 backdrop-blur-sm md:px-7 md:py-5">
          <div className="min-w-0">
            <div
              className={`${systemNumber.label} mb-1.5 text-[11px] md:text-xs ${textGradient}`}
            >
              STAGE {stageNumber} · {slide + 1} / {items.length}
            </div>
            <h2 className="truncate text-xl font-bold tracking-tight text-foreground md:text-2xl">
              {current.name}
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">{stageTitle}</p>
          </div>
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="shrink-0 rounded-full p-2 transition-colors hover:bg-white/[0.06]"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-foreground" />
          </motion.button>
        </div>

        <div className="relative min-h-0 flex-1 bg-background/80">
          <div className="relative flex h-[min(62vh,560px)] items-center justify-center md:h-[min(68vh,640px)]">
            <AnimatePresence mode="wait">
              <motion.img
                key={current.src}
                src={current.src}
                alt={current.name}
                className="max-h-full max-w-full object-contain"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28 }}
              />
            </AnimatePresence>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSlide((s) => (s - 1 + items.length) % items.length)
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/75 md:left-4"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSlide((s) => (s + 1) % items.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/55 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/75 md:right-4"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="shrink-0 space-y-3 border-t border-border px-5 py-4 md:px-7 md:py-5">
          <div className="flex flex-wrap gap-2">
            <span className={`${systemTag.base} ${systemTag.active}`}>
              {current.name}
            </span>
            {current.tools.map((tool) => (
              <span key={tool} className={`${systemTag.base} ${systemTag.idle}`}>
                {tool}
              </span>
            ))}
          </div>

          {items.length > 1 && (
            <div className="flex justify-center gap-1.5 pt-1">
              {items.map((item, i) => (
                <button
                  key={item.src + i}
                  type="button"
                  onClick={() => setSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === slide ? "w-5 bg-white" : "w-1.5 bg-white/35"
                  }`}
                  aria-label={item.name}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
