import { memo, useEffect, useMemo, useRef } from "react";
import "./warp.css";

// Flight background shared by Process and Cases: streaks fly out from the centre, far dots
// twinkle, nebulae in the corners, a dark vignette keeps the centre calm for content.
// Bump `jump` to make a short hyperspace jump: the streaks speed up and settle back.

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

const JUMP_MS = 900;
const JUMP_RATE = 6;

const WarpBackground = memo(function WarpBackground({ count = 60, jump = 0 }: { count?: number; jump?: number }) {
  const field = useRef<HTMLDivElement>(null);
  const { streaks, dots } = useMemo(() => {
    const r = seeded(33);
    const colors = ["241,238,232", "241,238,232", "241,238,232", "241,238,232", "241,238,232", "241,238,232", "236,72,153", "168,85,247", "96,150,255"];
    const streaks = Array.from({ length: count }, () => {
      const r0 = 330 + r() * 230;
      return { a: r() * 360, r0, r1: r0 + 520 + r() * 240, w: 50 + r() * 100, h: r() < 0.75 ? 1 : 1.5, c: colors[Math.floor(r() * colors.length)], o: 0.3 + r() * 0.4, dur: 2.8 + r() * 3.6, del: -r() * 6 };
    });
    const dots = Array.from({ length: 30 }, () => ({ x: 1 + r() * 98, y: 2 + r() * 96, dur: 3 + r() * 5, del: r() * 5 }));
    return { streaks, dots };
  }, [count]);

  useEffect(() => {
    if (!jump || !field.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anims = field.current.getAnimations({ subtree: true });
    const el = field.current;
    el.classList.add("jumping");
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / JUMP_MS);
      const rate = 1 + (JUMP_RATE - 1) * (1 - k) * (1 - k); // fast start, eases back to normal
      anims.forEach((a) => (a.playbackRate = rate));
      if (k < 1) raf = requestAnimationFrame(step);
      else el.classList.remove("jumping");
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); anims.forEach((a) => (a.playbackRate = 1)); el.classList.remove("jumping"); };
  }, [jump]);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(70% 70% at 50% 50%,#090B12 30%,#06080C 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(40% 40% at 0% 0%,rgba(168,85,247,.16),transparent 70%),radial-gradient(40% 40% at 100% 0%,rgba(59,130,246,.14),transparent 70%),radial-gradient(45% 45% at 0% 100%,rgba(236,72,153,.14),transparent 70%),radial-gradient(40% 40% at 100% 100%,rgba(168,85,247,.14),transparent 70%)" }} />
      {dots.map((d, i) => (
        <i key={i} className="absolute rounded-full" style={{ left: `${d.x}%`, top: `${d.y}%`, width: 1, height: 1, background: "#F1EEE8", opacity: 0.4, animation: `tw ${d.dur.toFixed(1)}s ease-in-out ${d.del.toFixed(1)}s infinite` }} />
      ))}
      <div ref={field} className="warp-field absolute" style={{ left: 720, top: 450, width: 0, height: 0 }}>
        {streaks.map((s, i) => (
          <i
            key={i}
            className="wp"
            style={{
              ["--a" as string]: `${s.a.toFixed(0)}deg`, ["--r0" as string]: `${s.r0.toFixed(0)}px`, ["--r1" as string]: `${s.r1.toFixed(0)}px`,
              width: s.w, height: s.h, background: `linear-gradient(90deg,transparent,rgba(${s.c},${s.o.toFixed(2)}))`,
              animationDuration: `${s.dur.toFixed(1)}s`, animationDelay: `${s.del.toFixed(1)}s`,
            }}
          />
        ))}
      </div>
      <div className="warp-flash absolute inset-0" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(55% 55% at 50% 50%,rgba(6,8,12,.5) 0%,rgba(6,8,12,0) 70%)" }} />
    </div>
  );
});

export default WarpBackground;
