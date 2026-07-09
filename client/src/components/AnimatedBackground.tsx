import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      offsetRef.current = window.scrollY;
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(${offsetRef.current * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ willChange: "transform" }}
    >
      <div className="absolute inset-0 bg-background" />

      {/* Soft mono washes — top only, so Contact stays clean */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ duration: 1.5 }}
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(244, 241, 234, 0.05) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.8, delay: 0.2 }}
        className="absolute -top-20 -right-40 w-[28rem] h-[28rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(244, 241, 234, 0.035) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,241,234,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,234,0.4) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
