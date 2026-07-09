import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";

export default function ProcessTimeline() {
  const { language } = useLanguage();
  const process = content[language].process;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        className="w-full max-w-5xl"
      >
        {/* Section Title */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold text-foreground mb-12 text-center"
        >
          {process.title}
        </motion.h2>

        {/* Steps - Desktop Horizontal */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-8">
            {process.steps.map((step: string, index: number) => (
              <motion.div
                key={step}
                variants={itemVariants}
                className="flex flex-col items-center flex-1"
              >
                {/* Step Circle */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-full bg-surface border-2 border-foreground flex items-center justify-center mb-4 cursor-pointer transition-all"
                >
                  <span className="text-sm font-bold text-foreground">{index + 1}</span>
                </motion.div>

                {/* Step Label */}
                <p className="text-center text-sm font-medium text-foreground-secondary">
                  {step}
                </p>

                {/* Connector Line */}
                {index < process.steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="absolute w-full h-0.5 bg-gradient-to-r from-foreground to-transparent"
                    style={{
                      left: "50%",
                      top: "3rem",
                      width: "calc(100% - 3rem)",
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Connector Line SVG */}
          <svg className="w-full h-12 mb-12" preserveAspectRatio="none">
            <motion.line
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
              stroke="currentColor"
              strokeWidth="2"
              className="text-foreground-muted"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
          </svg>
        </div>

        {/* Steps - Mobile Vertical */}
        <div className="md:hidden space-y-6">
          {process.steps.map((step: string, index: number) => (
            <motion.div
              key={step}
              variants={itemVariants}
              className="flex gap-4"
            >
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-surface border-2 border-foreground flex items-center justify-center flex-shrink-0"
                >
                  <span className="text-xs font-bold text-foreground">{index + 1}</span>
                </motion.div>

                {/* Vertical Line */}
                {index < process.steps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="w-0.5 h-12 bg-foreground-muted mt-2"
                  />
                )}
              </div>

              {/* Step Label */}
              <div className="pt-2">
                <p className="text-base font-medium text-foreground">{step}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Message */}
        <motion.div
          variants={itemVariants}
          className="mt-16 md:mt-20 p-8 bg-surface border border-border rounded-lg text-center"
        >
          <p className="text-lg md:text-xl text-foreground-secondary italic">
            {process.keyMessage}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
