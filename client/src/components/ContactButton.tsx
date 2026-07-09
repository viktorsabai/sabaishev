import { Mail } from "lucide-react";
import { motion } from "framer-motion";

interface ContactButtonProps {
  onClick?: () => void;
}

export default function ContactButton({ onClick }: ContactButtonProps) {
  const handleContactClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <motion.button
      onClick={handleContactClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="relative p-2.5 rounded-full bg-surface/50 backdrop-blur-sm border border-border hover:border-accent/50 transition-all duration-300 group"
      aria-label="Go to contact section"
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/20 to-accent-light/20"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div className="relative z-10">
        <Mail className="w-5 h-5 text-foreground-secondary group-hover:text-accent transition-colors duration-300" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold text-foreground-secondary whitespace-nowrap pointer-events-none"
      >
        Contact
      </motion.div>
    </motion.button>
  );
}
