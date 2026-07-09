import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { progressGradient } from "@/lib/systemUi";

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = documentHeight > 0 ? scrolled / documentHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-background/50 backdrop-blur-sm z-50"
    >
      <motion.div
        animate={{ width: `${scrollProgress * 100}%` }}
        transition={{ type: "tween", duration: 0.2 }}
        className={`h-full ${progressGradient}`}
      />
    </motion.div>
  );
}
