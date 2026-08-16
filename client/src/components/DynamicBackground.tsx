import { useEffect, useState } from "react";

export default function DynamicBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    // Static lightweight background for mobile to eliminate scroll jitter and layout re-calculations
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/30 to-background opacity-80" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.02] opacity-40" />
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-900/10 blur-[120px]"
      />
      <div
        className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-blue-900/10 blur-[120px]"
      />
    </div>
  );
}
