import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DynamicBackground() {
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

  // Subtle mono wash — no rainbow
  const colorStops = [
    { offset: 0, color: "from-white/[0.03] via-transparent to-transparent" },
    { offset: 0.35, color: "from-transparent via-white/[0.025] to-transparent" },
    { offset: 0.7, color: "from-transparent via-transparent to-white/[0.03]" },
    { offset: 1, color: "from-white/[0.02] via-transparent to-transparent" },
  ];

  // Get current gradient based on scroll progress
  const getCurrentGradient = () => {
    for (let i = 0; i < colorStops.length - 1; i++) {
      const current = colorStops[i];
      const next = colorStops[i + 1];
      if (scrollProgress >= current.offset && scrollProgress <= next.offset) {
        return current.color;
      }
    }
    return colorStops[0].color;
  };

  return (
    <>
      {/* Fixed background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Base mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />

        {/* Animated color overlay */}
        <motion.div
          animate={{
            background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
          }}
          transition={{ type: "tween", duration: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-br ${getCurrentGradient()} opacity-40`}
        />

        {/* Scroll-linked accent orbs */}
        <motion.div
          animate={{
            x: scrollProgress * 100,
            y: Math.sin(scrollProgress * Math.PI * 2) * 50,
          }}
          transition={{ type: "tween", duration: 0.3 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            x: -scrollProgress * 80,
            y: Math.cos(scrollProgress * Math.PI * 2) * 60,
          }}
          transition={{ type: "tween", duration: 0.3 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-light/10 rounded-full blur-3xl"
        />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' result='noise' /%3E%3C/filter%3E%3Crect width='400' height='400' fill='white' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background opacity-40" />
      </div>

      {/* Scroll progress indicator (optional) */}
      <motion.div
        animate={{ height: `${scrollProgress * 100}%` }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed top-0 right-0 w-1 bg-gradient-to-b from-accent to-accent-light -z-10"
      />
    </>
  );
}
