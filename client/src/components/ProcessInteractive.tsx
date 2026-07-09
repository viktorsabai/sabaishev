import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";
import { useState } from "react";

const processSteps = [
  {
    id: 1,
    titleRu: "Проблема",
    titleEn: "Problem",
    titleTh: "ปัญหา",
    descRu: "Формулирую задачу, отделяю симптом от причины, определяю пользователя, фиксирую бизнес-цель.",
    descEn: "Define the challenge, separate symptoms from root causes, identify users, establish business goals.",
    descTh: "กำหนดปัญหา แยกอาการจากสาเหตุ ระบุผู้ใช้ และกำหนดเป้าหมายทางธุรกิจ",
    icon: "🎯",
  },
  {
    id: 2,
    titleRu: "Исследование",
    titleEn: "Research",
    titleTh: "วิจัย",
    descRu: "Анализ рынка, конкуренты, пользовательские сценарии, JTBD, инсайты.",
    descEn: "Market analysis, competitive landscape, user scenarios, JTBD, key insights.",
    descTh: "วิเคราะห์ตลาด ศึกษาคู่แข่ง สถานการณ์ผู้ใช้ JTBD และข้อมูลเชิงลึก",
    icon: "🔍",
  },
  {
    id: 3,
    titleRu: "Продуктовая логика",
    titleEn: "Product Logic",
    titleTh: "ตรรมชาติของผลิตภัณฑ์",
    descRu: "MVP scope, roadmap, user stories, feature map, приоритизация.",
    descEn: "MVP scope, roadmap, user stories, feature map, prioritization.",
    descTh: "ขอบเขต MVP แผนพัฒนา เรื่องราวผู้ใช้ แผนฟีเจอร์ และการจัดลำดับความสำคัญ",
    icon: "📋",
  },
  {
    id: 4,
    titleRu: "UX",
    titleEn: "UX",
    titleTh: "ประสบการณ์ผู้ใช้",
    descRu: "User flow, структура экранов, wireframes, сценарии, логика навигации.",
    descEn: "User flows, screen structure, wireframes, scenarios, navigation logic.",
    descTh: "การไหลของผู้ใช้ โครงสร้างหน้าจอ ลวดลาย สถานการณ์ และตรรมชาติของการนำทาง",
    icon: "🎨",
  },
  {
    id: 5,
    titleRu: "UI",
    titleEn: "UI",
    titleTh: "ส่วนติดต่อผู้ใช้",
    descRu: "Visual system, компоненты, состояния, адаптив, дизайн-система.",
    descEn: "Visual system, components, states, responsive design, design system.",
    descTh: "ระบบภาพ องค์ประกอบ สถานะ การตอบสนองต่อขนาด และระบบการออกแบบ",
    icon: "✨",
  },
  {
    id: 6,
    titleRu: "AI-архитектура",
    titleEn: "AI Architecture",
    titleTh: "สถาปัตยกรรม AI",
    descRu: "LLM logic, prompts, генерация контента, automation, speech / text / data flows.",
    descEn: "LLM logic, prompts, content generation, automation, speech/text/data flows.",
    descTh: "ตรรมชาติของ LLM พรอมต์ การสร้างเนื้อหา ระบบอัตโนมัติ และการไหลของข้อมูล",
    icon: "🤖",
  },
  {
    id: 7,
    titleRu: "Прототип",
    titleEn: "Prototype",
    titleTh: "ต้นแบบ",
    descRu: "Кликабельный MVP, frontend logic, тестирование сценариев, быстрые итерации.",
    descEn: "Clickable MVP, frontend logic, scenario testing, rapid iterations.",
    descTh: "MVP ที่คลิกได้ ตรรมชาติของ frontend การทดสอบสถานการณ์ และการปรับปรุงอย่างรวดเร็ว",
    icon: "🚀",
  },
  {
    id: 8,
    titleRu: "Запуск",
    titleEn: "Launch",
    titleTh: "การเปิดตัว",
    descRu: "Deployment, аналитика, сбор обратной связи, улучшения, масштабирование.",
    descEn: "Deployment, analytics, feedback collection, improvements, scaling.",
    descTh: "การปรับใช้ การวิเคราะห์ การรวบรวมข้อมูลย้อนกลับ การปรับปรุง และการขยายขนาด",
    icon: "📈",
  },
];

export default function ProcessInteractive() {
  const { language } = useLanguage();
  const [selectedStep, setSelectedStep] = useState(1);

  const getTitle = (step: typeof processSteps[0]) => {
    if (language === "en") return step.titleEn;
    if (language === "th") return step.titleTh;
    return step.titleRu;
  };

  const getDesc = (step: typeof processSteps[0]) => {
    if (language === "en") return step.descEn;
    if (language === "th") return step.descTh;
    return step.descRu;
  };

  const selectedStepData = processSteps.find((s) => s.id === selectedStep);

  return (
    <section className="space-section px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full max-w-6xl mx-auto"
      >
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-display-md md:text-display-lg font-bold text-foreground mb-4 text-center"
        >
          {language === "ru" ? "Процесс" : language === "en" ? "Process" : "กระบวนการ"}
        </motion.h2>

        {/* Key Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-foreground-secondary text-lg md:text-xl mb-16 italic max-w-3xl mx-auto"
        >
          {language === "ru"
            ? "Большинство людей закрывают один-два этапа. Я собираю всю систему."
            : language === "en"
              ? "Most people cover one or two stages. I build the entire system."
              : "คนส่วนใหญ่ครอบคลุมหนึ่งหรือสองขั้นตอน ฉันสร้างระบบทั้งหมด"}
        </motion.p>

        {/* Steps Navigation - Desktop */}
        <div className="hidden md:block mb-12">
          <div className="flex justify-between items-center gap-2">
            {processSteps.map((step, index) => (
              <motion.div key={step.id} className="flex-1 flex flex-col items-center">
                {/* Step Button */}
                <motion.button
                  onClick={() => setSelectedStep(step.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    selectedStep === step.id
                      ? "bg-foreground text-background shadow-lg"
                      : "bg-surface border border-border text-foreground hover:bg-surface-elevated"
                  }`}
                >
                  {step.id}
                </motion.button>

                {/* Step Label */}
                <p
                  className={`text-xs font-medium mt-3 text-center transition-colors ${
                    selectedStep === step.id ? "text-foreground" : "text-foreground-muted"
                  }`}
                >
                  {getTitle(step)}
                </p>

                {/* Connector Line */}
                {index < processSteps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="absolute w-full h-0.5 bg-gradient-to-r from-foreground to-transparent"
                    style={{
                      left: "50%",
                      top: "1.5rem",
                      width: "calc(100% + 1rem)",
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Steps Navigation - Mobile (Horizontal Scroll) */}
        <div className="md:hidden mb-12 overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-min px-4">
            {processSteps.map((step) => (
              <motion.button
                key={step.id}
                onClick={() => setSelectedStep(step.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all ${
                  selectedStep === step.id
                    ? "bg-foreground text-background"
                    : "bg-surface border border-border text-foreground"
                }`}
              >
                {getTitle(step)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Step Details Card */}
        <AnimatePresence mode="wait">
          {selectedStepData && (
            <motion.div
              key={selectedStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-8 md:p-12 bg-surface border border-border rounded-lg"
            >
              {/* Icon and Title */}
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">{selectedStepData.icon}</span>
                <div>
                  <h3 className="text-heading-lg font-bold text-foreground">
                    {getTitle(selectedStepData)}
                  </h3>
                  <p className="text-sm text-foreground-muted mt-1">
                    {language === "ru"
                      ? `Этап ${selectedStep} из 8`
                      : language === "en"
                        ? `Step ${selectedStep} of 8`
                        : `ขั้นตอนที่ ${selectedStep} จาก 8`}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-body-lg text-foreground-secondary leading-relaxed">
                {getDesc(selectedStepData)}
              </p>

              {/* Progress Indicator */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-surface-elevated rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedStep / 8) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-foreground"
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground-muted">
                    {Math.round((selectedStep / 8) * 100)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
