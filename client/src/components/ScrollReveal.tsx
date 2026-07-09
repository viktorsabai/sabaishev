import { motion } from "framer-motion";
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
  duration = 0.6,
  className = "",
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
    triggerOnce: true,
  });

  const variants = {
    // Reveal: Fade in + subtle scale
    reveal: {
      hidden: { opacity: 0, scale: 0.98, y: 20 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration,
          delay,
        },
      },
    },

    // Build: Elements appear in stages
    build: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: duration * 0.8,
          delay,
        },
      },
    },

    // Stagger: For list items
    stagger: {
      hidden: { opacity: 0, x: -20 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: duration * 0.6,
          delay,
        },
      },
    },

    // Morph: Expand from center
    morph: {
      hidden: { opacity: 0, scale: 0.9, y: 30 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: duration * 1.2,
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

// Container for staggering multiple children
interface ScrollRevealContainerProps {
  children: ReactNode;
  type?: RevealType;
  staggerDelay?: number;
  className?: string;
}

export function ScrollRevealContainer({
  children,
  type = "stagger",
  staggerDelay = 0.1,
  className = "",
}: ScrollRevealContainerProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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
