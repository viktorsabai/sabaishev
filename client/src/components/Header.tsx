import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import ContactButton from "./ContactButton";
import { textGradient } from "@/lib/systemUi";

interface HeaderProps {
  onContactClick: () => void;
}

export default function Header({ onContactClick }: HeaderProps) {
  const scrollTop = () => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-16 md:px-6 lg:px-8">
        <motion.button
          type="button"
          onClick={scrollTop}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-2.5"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-lg leading-none transition-transform group-hover:scale-105"
            aria-hidden
          >
            🧙
          </span>
          <span className={`text-sm font-bold tracking-tight md:text-[15px] ${textGradient}`}>
            VIKTOR.SYSTEM
          </span>
        </motion.button>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <ContactButton onClick={onContactClick} />
        </div>
      </div>
    </motion.header>
  );
}
