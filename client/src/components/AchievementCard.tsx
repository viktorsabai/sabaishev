import { motion } from "framer-motion";

interface AchievementCardProps {
  value: string;
  label: string;
  description: string;
  targetSection: string;
  index: number;
  onNavigate: (sectionId: string) => void;
}

export default function AchievementCard({
  value,
  label,
  description,
  targetSection,
  index,
  onNavigate,
}: AchievementCardProps) {
  const handleClick = () => {
    onNavigate(targetSection);
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={handleClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group relative w-full text-left"
    >
      {/* Card Container - Minimal */}
      <div className="p-4 md:p-6 transition-all duration-300 hover:opacity-80 cursor-pointer">
        {/* Value - Normal size, not huge */}
        <motion.div
          className="text-3xl md:text-4xl font-bold text-foreground mb-2"
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.1 }}
        >
          {value}
        </motion.div>

        {/* Label - Small and muted */}
        <motion.p
          className="text-xs md:text-sm text-foreground-muted/70 mb-1 tracking-wide uppercase"
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.15 }}
        >
          {label}
        </motion.p>

        {/* Description - Regular text */}
        <motion.p
          className="text-sm md:text-base text-foreground-muted leading-relaxed"
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.2 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.button>
  );
}
