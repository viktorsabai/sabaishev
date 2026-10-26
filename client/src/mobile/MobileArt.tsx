import { memo, useEffect, useState } from "react";
import WarpBackground from "@/scene/WarpBackground";
import { DOTS } from "@/scene/stage";
import { DEFS, ROOMS } from "@/scene/v2/markup";
import { roomLayers } from "@/scene/v2/roomLayers";
import { SHIP_EXTRAS, SHIP_LAYERS } from "@/scene/v2/shipLayers";
import "@/scene/v2/v2.css";

// The desktop scene's art, framed for a phone: the same ship assembling in layers, the same
// deck rooms, and the flight background behind every page. Each SVG crops the 1440×900 scene
// coordinates to the drawing it shows.

// Gradients and filters the drawings reference (#lgc, #lgv, #gl …), once per page.
export const ArtDefs = memo(function ArtDefs() {
  return <svg width="0" height="0" className="absolute" aria-hidden="true"><defs dangerouslySetInnerHTML={{ __html: DEFS }} /></svg>;
});

// The flight background, scaled to cover the screen and fixed behind the page.
export function MobileWarp() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.max(window.innerWidth / 1440, window.innerHeight / 900));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return (
    <div className="mx-warp" aria-hidden="true">
      <div className="sx" style={{ position: "absolute", left: "50%", top: "50%", width: 1440, height: 900, transform: `translate(-50%,-50%) scale(${scale})`, background: "none" }}>
        <WarpBackground count={40} />
      </div>
    </div>
  );
}

// Deck dots on the ship, in the ship's viewBox.
const SHIP_BOX = { x: 560, y: 130, w: 610, h: 640 };
export const DECK_DOTS = DOTS.slice(0, 8).map(([x, y]) => ({ left: `${((x - SHIP_BOX.x) / SHIP_BOX.w) * 100}%`, top: `${((y - SHIP_BOX.y) / SHIP_BOX.h) * 100}%` }));

export const MobileShip = memo(function MobileShip({ label }: { label: string }) {
  return (
    <svg role="img" aria-label={label} viewBox={`${SHIP_BOX.x} ${SHIP_BOX.y} ${SHIP_BOX.w} ${SHIP_BOX.h}`} className="mx-ship" fill="none">
      <g className="shipg">
        {SHIP_LAYERS.map((html, i) => (
          <g key={i} className="lyr" style={{ ["--ld" as string]: `${0.15 + i * 0.22}s` }} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
        <g dangerouslySetInnerHTML={{ __html: SHIP_EXTRAS }} />
      </g>
    </svg>
  );
});

// A deck's room, assembling layer by layer. Keyed by the caller per visit, so it builds again.
export const MobileRoom = memo(function MobileRoom({ stage, num, label }: { stage: number; num: string; label: string }) {
  const { layers, beam } = roomLayers(ROOMS[stage - 1].room, `<text class="wn" transform="matrix(.866 .5 0 1 943.6 352.8)" font-size="74">${num}</text>`);
  const html = `<g class="roomg">${layers.map((l, i) => `<g class="rlay" style="--ld:${(0.1 + i * 0.26).toFixed(2)}s">${l}</g>`).join("")}${beam}</g>`;
  return <svg role="img" aria-label={label} viewBox="575 255 590 530" className="mx-room" fill="none" dangerouslySetInnerHTML={{ __html: html }} />;
});
