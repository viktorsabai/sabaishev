import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import BootScreen from "@/components/BootScreen";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StackCapabilities from "@/components/StackCapabilities";
import ProductModules from "@/components/ProductModules";
import ProcessWorkspace from "@/components/ProcessWorkspace";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";
import SideNavigation from "@/components/SideNavigation";
import DynamicBackground from "@/components/DynamicBackground";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import MobileBreadcrumb from "@/components/MobileBreadcrumb";
import ConversionPrompt from "@/components/ConversionPrompt";

export default function Home() {
  const [showBoot, setShowBoot] = useState(true);
  const contactRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const handleBootComplete = () => {
    setShowBoot(false);
  };

  const handleExploreClick = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactClick = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <AnimatePresence>
        {showBoot && <BootScreen onComplete={handleBootComplete} />}
      </AnimatePresence>

      <DynamicBackground />
      <SideNavigation />
      <ScrollProgressBar />
      <MobileBreadcrumb />

      <Header onContactClick={handleContactClick} />

      <main className="md:pt-20">
        <Hero onExploreClick={handleExploreClick} onContactClick={handleContactClick} />
        <StackCapabilities />
        <div ref={productsRef}>
          <ProductModules />
        </div>
        <ConversionPrompt
          titleRu="Нашли похожую задачу?"
          titleEn="Found a similar challenge?"
          titleTh="เจอโจทย์ที่ใกล้เคียงไหม?"
          subtitleRu="Соберите бриф за минуту — без долгой переписки и лишних звонков."
          subtitleEn="Build a brief in a minute — no lengthy emails or unnecessary calls."
          subtitleTh="สร้างบรีฟในหนึ่งนาที — ไม่ต้องพิมพ์ยาวหรือโทรหลายครั้ง"
        />
        <ProcessWorkspace />
        <Experience />
        <ConversionPrompt
          titleRu="Готовы обсудить контекст?"
          titleEn="Ready to discuss the context?"
          titleTh="พร้อมคุยเรื่องบริบทของโปรเจกต์ไหม?"
          subtitleRu="Перейдём от примеров и опыта к вашей задаче. Отвечу сегодня."
          subtitleEn="Let's move from examples and experience to your challenge. I reply today."
          subtitleTh="เปลี่ยนจากตัวอย่างและประสบการณ์มาคุยเรื่องโจทย์ของคุณ ผมจะตอบกลับวันนี้"
        />
        <div ref={contactRef}>
          <Contact />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
