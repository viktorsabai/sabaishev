import { cn } from "@/lib/utils";

const FAIRY_SRC = "/fairy.png";

type FairyMarkProps = {
  className?: string;
};

/** Woman fairy mark — custom asset, transparent background */
export default function FairyMark({ className }: FairyMarkProps) {
  return (
    <img
      src={FAIRY_SRC}
      alt=""
      aria-hidden
      draggable={false}
      className={cn("pointer-events-none select-none object-contain", className)}
    />
  );
}
