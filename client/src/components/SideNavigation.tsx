import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { progressGradient, systemNumber } from "@/lib/systemUi";

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

export default function SideNavigation() {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1)
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = documentHeight > 0 ? scrolled / documentHeight : 0;
      setScrollProgress(progress);

      // Determine active section based on scroll position
      const sectionHeight = documentHeight / (SECTIONS.length - 1);
      const currentSection = Math.min(
        Math.floor(progress * (SECTIONS.length - 1)),
        SECTIONS.length - 1
      );
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (index: number) => {
    const section = SECTIONS[index];
    const element = document.getElementById(section.id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed left-6 md:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-8"
    >
      {/* Section Dots Navigation */}
      <div className="flex flex-col gap-6">
        {SECTIONS.map((section, index) => {
          const isActive = index === activeSection;

          return (
            <motion.div
              key={section.id}
              className="flex items-center gap-3 group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Section Number (hidden by default, shown on hover) */}
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`${systemNumber.label} text-[10px] text-foreground-muted/50 whitespace-nowrap pointer-events-none`}
              >
                {String(section.number).padStart(2, "0")}
              </motion.span>

              {/* Navigation Button */}
              <motion.button
                onClick={() => handleNavigate(index)}
                whileHover={{ scale: 1.4 }}
                whileTap={{ scale: 0.9 }}
                className={`relative w-3 h-3 rounded-full transition-all duration-300 group`}
              >
                {/* Background dot */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-accent scale-100"
                      : "bg-foreground-muted/30 hover:bg-foreground-muted/60 scale-75"
                  }`}
                />

                {/* Hover ring */}
                <motion.div
                  animate={isActive ? { scale: 2.5 } : { scale: 1 }}
                  className="absolute inset-0 rounded-full border border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.button>

              {/* Tooltip label */}
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute left-12 text-xs font-semibold text-foreground-muted whitespace-nowrap pointer-events-none"
              >
                {section.label}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      {/* Vertical Progress Line */}
      <motion.div className="absolute left-1.5 top-0 w-0.5 h-full bg-white/10 rounded-full -z-10">
        <motion.div
          animate={{ height: `${scrollProgress * 100}%` }}
          transition={{ type: "tween", duration: 0.3 }}
          className={`w-full rounded-full ${progressGradient}`}
        />
      </motion.div>
    </motion.div>
  );
}
