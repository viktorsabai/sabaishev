import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface SectionDividerProps {
  label?: string;
  onClick?: () => void;
}

export default function SectionDivider({ label, onClick }: SectionDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative py-12 md:py-16 flex flex-col items-center justify-center"
    >
      {/* Animated arrow */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative p-3 rounded-full bg-gradient-to-br from-accent/20 to-accent-light/20 border border-accent/30 hover:border-accent/50 transition-all duration-300 group"
        aria-label="Scroll to next section"
      >
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/20 to-accent-light/20"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon */}
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative z-10"
        >
          <ChevronDown className="w-6 h-6 text-accent group-hover:text-accent-light transition-colors duration-300" />
        </motion.div>
      </motion.button>

      {/* Optional label */}
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-4 text-xs md:text-sm font-semibold text-foreground-muted uppercase tracking-widest"
        >
          {label}
        </motion.p>
      )}

      {/* Vertical line */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-full mt-4 w-0.5 h-16 md:h-24 bg-gradient-to-b from-accent/50 to-transparent origin-top"
      />
    </motion.div>
  );
}
