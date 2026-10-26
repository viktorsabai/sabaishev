import type { CasesCopy } from "./content";

// The service slot's screens: a site assembles block by block (outline first, then fill), with
// code comments naming what each block is for. Plays every time the slot comes up.

type Block = { x: number; y: number; w: number; h: number; d: number; kind?: "img" | "btn" | "fill" | "bar" };

const DESKTOP: Block[] = [
  { x: 24, y: 16, w: 742, h: 30, d: 0.1 },
  { x: 470, y: 72, w: 280, h: 196, d: 0.45, kind: "img" },
  { x: 40, y: 190, w: 300, h: 8, d: 0.6, kind: "bar" },
  { x: 40, y: 206, w: 220, h: 8, d: 0.66, kind: "bar" },
  { x: 40, y: 300, w: 220, h: 86, d: 0.95, kind: "fill" },
  { x: 285, y: 300, w: 220, h: 86, d: 1.05, kind: "fill" },
  { x: 530, y: 300, w: 220, h: 86, d: 1.15, kind: "fill" },
  { x: 40, y: 408, w: 710, h: 74, d: 1.35 },
];
const PHONE: Block[] = [
  { x: 10, y: 22, w: 150, h: 18, d: 0.1 },
  { x: 14, y: 100, w: 110, h: 5, d: 0.5, kind: "bar" },
  { x: 14, y: 110, w: 80, h: 5, d: 0.55, kind: "bar" },
  { x: 14, y: 156, w: 142, h: 80, d: 0.7, kind: "img" },
  { x: 14, y: 246, w: 68, h: 46, d: 0.95, kind: "fill" },
  { x: 88, y: 246, w: 68, h: 46, d: 1.05, kind: "fill" },
  { x: 14, y: 302, w: 142, h: 36, d: 1.3 },
];

function Blocks({ list }: { list: Block[] }) {
  return (
    <>
      {list.map((b, i) => (
        <div key={i} className={`sb${b.kind ? ` ${b.kind}` : ""}`} style={{ left: b.x, top: b.y, width: b.w, height: b.h, ["--d" as string]: `${b.d}s` }}>
          {b.kind === "img" && (
            <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">
              <line x1="0" y1="0" x2="100%" y2="100%" />
              <line x1="100%" y1="0" x2="0" y2="100%" />
            </svg>
          )}
        </div>
      ))}
    </>
  );
}

export default function SiteBuild({ mock, phone }: { mock: CasesCopy["mock"]; phone?: boolean }) {
  if (phone) {
    return (
      <div className="sbw" aria-hidden="true">
        <Blocks list={PHONE} />
        <div className="sb txt" style={{ left: 14, top: 52, fontSize: 19, ["--d" as string]: "0.3s" }}>{mock.title}<br /><span className="gt">{mock.accent}</span></div>
        <div className="sb btn" style={{ left: 14, top: 124, width: 110, height: 22, fontSize: 8.5, ["--d" as string]: "0.62s" }}>{mock.cta}</div>
      </div>
    );
  }
  return (
    <div className="sbw" aria-hidden="true">
      <i className="sbp" />
      <Blocks list={DESKTOP} />
      <div className="sb txt" style={{ left: 40, top: 76, fontSize: 46, ["--d" as string]: "0.3s" }}>{mock.title}<br /><span className="gt">{mock.accent}</span></div>
      <div className="sb btn" style={{ left: 40, top: 232, width: 180, height: 42, fontSize: 13, ["--d" as string]: "0.75s" }}>{mock.cta}</div>
      <div className="sb txt mono" style={{ left: 58, top: 418, fontSize: 10, letterSpacing: ".16em", ["--d" as string]: "1.5s" }}>{mock.form.toUpperCase()}</div>
      <div className="sb" style={{ left: 58, top: 440, width: 230, height: 28, ["--d" as string]: "1.55s" }} />
      <div className="sb" style={{ left: 300, top: 440, width: 230, height: 28, ["--d" as string]: "1.6s" }} />
      <div className="sb btn" style={{ left: 545, top: 440, width: 188, height: 28, fontSize: 10.5, ["--d" as string]: "1.7s" }}>{mock.cta}</div>
      {/* What each block is for, as code comments next to it */}
      {([[600, 52, 0.4], [232, 286, 1.0], [520, 392, 1.4], [560, 488, 1.85]] as const).map(([x, y, d], i) => (
        <div key={i} className="sbn mono" style={{ left: x, top: y, ["--d" as string]: `${d}s` }}>// {mock.notes[i]}</div>
      ))}
    </div>
  );
}
