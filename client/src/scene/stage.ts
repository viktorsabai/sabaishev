import { useEffect, useState } from "react";

// Shared geometry of the scene pages. Every page is authored on a fixed 1440×900 canvas (same
// as the Claude Design mockups) and scaled to fit the viewport, so each keeps one composition.
export const W = 1440;
export const H = 900;

// Deck anchor dots on the ship (hero coordinates) and label placement around it.
// 0–7 are the stage decks; 8 is the bridge orb on top.
export const DOTS: [number, number][] = [
  [816.1, 539.7], [841, 476.1], [872.9, 408.4], [904.9, 340.8],
  [929.8, 281.3], [965.3, 414.6], [912, 691.4], [652.7, 707.9],
  [965.3, 305.9],
];
export const LABELS: [number, number, "end" | "start" | "middle"][] = [
  [695.5, 478.2, "end"], [720.4, 414.6, "end"], [752.4, 346.9, "end"], [784.3, 279.3, "end"],
  [809.2, 219.8, "end"], [1146.5, 318.1, "start"], [912, 790.4, "middle"], [624.7, 768.9, "middle"],
];

export function useStageScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}
