import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import ContactButton from "./ContactButton";

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
          className="group flex min-w-0 items-center gap-2"
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center text-xl leading-none"
            aria-hidden
          >
            {"🧚🏿‍♀️"}
          </span>
          <span className="truncate text-sm font-semibold tracking-tight text-foreground md:text-[15px]">
            VIKTOR.SYSTEM
          </span>
        </motion.button>

        <div className="flex shrink-0 items-center gap-1.5 md:gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <ContactButton onClick={onContactClick} />
        </div>
      </div>
    </motion.header>
  );
}
