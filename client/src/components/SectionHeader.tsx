import { motion } from "framer-motion";
import { systemNumber, textGradient } from "@/lib/systemUi";

interface SectionHeaderProps {
  number: number;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  number,
  title,
  subtitle,
  align = "center",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      className={`mb-8 md:mb-16 ${alignClass}`}
    >
      {/* Section Number */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={`${systemNumber.label} text-xs md:text-sm mb-3 md:mb-4 ${textGradient}`}
      >
        {String(number).padStart(2, "0")}
      </motion.div>

      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-display-sm md:text-display-md font-bold text-foreground"
      >
        {title}
      </motion.h2>

      {/* Optional Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-body-sm md:text-body text-foreground-secondary mt-3 md:mt-4 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
