import { useEffect, useState } from "react";
import type { Slogan } from "./content";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Agent-style hero: types a slogan, holds it, erases it, moves to the next one.
// Paused while a room is open, so nothing on the page updates behind the room.
export function useTypewriter(slogans: Slogan[], paused: boolean) {
  const [state, setState] = useState({ idx: 0, len: 0, done: false });
  useEffect(() => {
    if (paused) return;
    if (reducedMotion()) {
      setState({ idx: 0, len: Infinity, done: true });
      const id = window.setInterval(() => setState((s) => ({ ...s, idx: (s.idx + 1) % slogans.length })), 7000);
      return () => window.clearInterval(id);
    }
    let idx = 0, len = 0, timer = 0;
    const full = () => slogans[idx].lead + slogans[idx].accent;
    const type = () => {
      len += 1;
      setState({ idx, len, done: len >= full().length });
      timer = window.setTimeout(len >= full().length ? erase : type, len >= full().length ? 4200 : 42);
    };
    const erase = () => {
      len = Math.max(0, len - 2);
      setState({ idx, len, done: false });
      if (len > 0) timer = window.setTimeout(erase, 16);
      else { idx = (idx + 1) % slogans.length; timer = window.setTimeout(type, 380); }
    };
    setState({ idx: 0, len: 0, done: false });
    timer = window.setTimeout(type, 700);
    return () => window.clearTimeout(timer);
  }, [slogans, paused]);
  return state;
}

