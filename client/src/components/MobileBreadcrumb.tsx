import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { systemNumber, textGradient } from "@/lib/systemUi";

interface Section {
  id: string;
  label: string;
  number: number;
}

const SECTIONS: Section[] = [
  { id: "hero", label: "Hero", number: 0 },
  { id: "stack", label: "Stack", number: 1 },
  { id: "products", label: "Products", number: 2 },
  { id: "process", label: "Process", number: 3 },
  { id: "experience", label: "Experience", number: 4 },
  { id: "contact", label: "Contact", number: 5 },
];

export default function MobileBreadcrumb() {
  const [currentSection, setCurrentSection] = useState<Section>(SECTIONS[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find current section based on viewport
      const sections = SECTIONS.map((s) => ({
        ...s,
        element: document.getElementById(s.id),
      })).filter((s) => s.element);

      let activeSection = SECTIONS[0];
      const viewportCenter = window.innerHeight / 2;

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            activeSection = section;
            break;
          }
        }
      }

      setCurrentSection(activeSection);
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="fixed top-16 left-0 right-0 z-40 lg:hidden bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3"
        >
          <div className="flex items-center gap-2 text-xs md:text-sm">
            {/* Section Number */}
            <span className={`${systemNumber.label} text-xs ${textGradient}`}>
              {String(currentSection.number).padStart(2, "0")}
            </span>

            {/* Divider */}
            <div className="w-1 h-1 rounded-full bg-foreground-muted/30" />

            {/* Section Label */}
            <motion.span
              key={currentSection.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="text-foreground font-medium"
            >
              {currentSection.label}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
