import { useEffect, useState } from "react";

// Types text out character by character after a delay. The untyped rest is laid out invisibly,
// so the block keeps its final size from the start and nothing below it jumps.
export default function TypedText({ text, delay = 0, cps = 70 }: { text: string; delay?: number; cps?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(text.length); return; }
    setN(0);
    let timer = window.setTimeout(function tick() {
      setN((v) => {
        if (v >= text.length) return v;
        timer = window.setTimeout(tick, 1000 / cps);
        return v + 1;
      });
    }, delay * 1000);
    return () => window.clearTimeout(timer);
  }, [text, delay, cps]);
  const done = n >= text.length;
  return (
    <span aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      {!done && <span aria-hidden="true" className="tcaret" />}
      <span aria-hidden="true" style={{ opacity: 0 }}>{text.slice(n)}</span>
    </span>
  );
}
