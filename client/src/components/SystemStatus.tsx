import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";
import AchievementSpiral from "./AchievementSpiral";

export default function SystemStatus() {
  const { language } = useLanguage();
  const trackRecord =
    content[language].trackRecord ?? content[language].systemStatus;

  return (
    <ScrollReveal type="reveal" duration={0.8}>
      <section id="system-status" className="min-h-screen flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-7xl"
        >
          {/* Section Header */}
          <SectionHeader 
            number={1} 
            title={trackRecord?.title ?? "Track Record"}
          />

          {/* Achievement Spiral Visualization */}
          <AchievementSpiral />
        </motion.div>
      </section>
    </ScrollReveal>
  );
}
