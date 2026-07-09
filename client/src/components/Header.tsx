import { motion } from "framer-motion";
import LanguageToggle from "./LanguageToggle";
import ContactButton from "./ContactButton";
import HeaderTypingPresence from "./HeaderTypingPresence";

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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <motion.button
          type="button"
          onClick={scrollTop}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="group min-w-0 text-left"
        >
          <HeaderTypingPresence />
        </motion.button>

        <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
          <LanguageToggle />
          <ContactButton onClick={onContactClick} />
        </div>
      </div>
    </motion.header>
  );
}
