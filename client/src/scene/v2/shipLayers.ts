import { SHIP } from "./markup";

// Splits the ship drawing into horizontal layers, bottom to top, so the ship can assemble
// like a layer cake: each layer drops into place and draws its lines, then the next one.
// Per-path draw delays from the mockup are dropped; the layer sets the timing instead.

const LAYERS = 7;

const elements = SHIP.match(/<path [^>]*\/>/g) ?? [];

// Vertical centre of a path from the coordinates in its d attribute.
function centreY(el: string) {
  const d = el.match(/ d="([^"]*)"/)?.[1] ?? "";
  const nums = (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  const ys = nums.filter((_, i) => i % 2 === 1);
  return ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : 0;
}

const isDrawn = (el: string) => el.includes('class="dr ');
const drawn = elements.filter(isDrawn).map((el) => ({ el: el.replace(/ style="animation-delay:[^"]*"/, ""), y: centreY(el) }));
const sortedY = drawn.map((p) => p.y).sort((a, b) => b - a); // bottom (large y) first
const bounds = Array.from({ length: LAYERS - 1 }, (_, i) => sortedY[Math.round(((i + 1) * sortedY.length) / LAYERS)]);

// Layer markup, index 0 = bottom layer.
export const SHIP_LAYERS: string[] = Array.from({ length: LAYERS }, () => "");
for (const p of drawn) {
  const layer = bounds.filter((b) => p.y < b).length;
  SHIP_LAYERS[layer] += p.el;
}

// Dimension line and engine flames keep their own timing (flames light up after assembly).
export const SHIP_EXTRAS = elements.filter((el) => !isDrawn(el)).join("");
