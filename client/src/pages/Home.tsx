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
        <ProcessWorkspace />
        <Experience />
        <div ref={contactRef}>
          <Contact />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
