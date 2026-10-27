import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CasesCopy, Prototype } from "./content";
import "./proto.css";

// A clickable prototype over the blurred cases page, in a browser frame like the case
// screens. The prototype is drawn on a fixed canvas (1440×900), so the frame scales it to fit
// whatever space there is; taps and scrolls go straight into it. Rendered into <body>, since
// the cases scene sits in a scaled stage that would otherwise scale the viewer too.

export default function ProtoViewer({ proto, copy, onClose }: { proto: Prototype; copy: CasesCopy["proto"]; onClose: () => void }) {
  const area = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [portrait, setPortrait] = useState(false);

  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const fit = () => {
      setScale(Math.min(el.clientWidth / proto.w, el.clientHeight / proto.h));
      setPortrait(window.innerWidth < 760 && window.innerHeight > window.innerWidth);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [proto]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return createPortal(
    <div className="pv" role="dialog" aria-modal="true" aria-label={`${proto.host} · ${copy.tag}`} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pv-win">
        <div className="pv-bar">
          <i style={{ background: "#EC4899" }} /><i style={{ background: "#A855F7" }} /><i style={{ background: "#3B82F6" }} />
          <span className="pv-host">{proto.host}</span>
          <span className="pv-tag">{copy.tag}</span>
          <span className="pv-sp" />
          <a className="pv-btn" href={proto.src} target="_blank" rel="noopener noreferrer">{copy.full} ↗</a>
          <button type="button" className="pv-x" onClick={onClose} aria-label={copy.close}>
            <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" /></svg>
          </button>
        </div>
        <div ref={area} className="pv-area">
          {scale > 0 && (
            <div className="pv-canvas" style={{ width: proto.w * scale, height: proto.h * scale }}>
              <iframe
                title={proto.host}
                src={proto.src}
                width={proto.w}
                height={proto.h}
                style={{ transform: `scale(${scale})` }}
                onLoad={() => setLoaded(true)}
              />
              {!loaded && <div className="pv-load"><i />{copy.loading}</div>}
            </div>
          )}
        </div>
        <div className="pv-foot">
          <span>{copy.note}</span>
          {portrait && <span className="pv-rot">↻ {copy.rotate}</span>}
        </div>
      </div>
    </div>,
    document.body,
  );
}
