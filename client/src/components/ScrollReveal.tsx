import { motion, Variants } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ReactNode } from "react";

type RevealType = "reveal" | "build" | "stagger" | "morph";

interface ScrollRevealProps {
  children: ReactNode;
  type?: RevealType;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  type = "reveal",
  delay = 0,
  duration = 0.35,
  className = "",
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.05,
    rootMargin: "0px 0px -20px 0px",
    triggerOnce: true,
  });

  const variants: Record<RevealType, Variants> = {
    reveal: {
      hidden: { opacity: 0, y: 14 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring" as const,
          stiffness: 350,
          damping: 30,
          delay,
        },
      },
    },
    build: {
      hidden: { opacity: 0, scale: 0.98 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          type: "spring" as const,
          stiffness: 400,
          damping: 28,
          delay,
        },
      },
    },
    stagger: {
      hidden: { opacity: 0, y: 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring" as const,
          stiffness: 350,
          damping: 30,
          delay,
        },
      },
    },
    morph: {
      hidden: { opacity: 0, scale: 0.96, y: 16 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
          delay,
        },
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants[type]}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollRevealContainerProps {
  children: ReactNode;
  type?: RevealType;
  staggerDelay?: number;
  className?: string;
}

export function ScrollRevealContainer({
  children,
  type = "stagger",
  staggerDelay = 0.04,
  className = "",
}: ScrollRevealContainerProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.05,
    rootMargin: "0px 0px -20px 0px",
    triggerOnce: true,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.02,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children)
        ? (children as ReactNode[]).map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
