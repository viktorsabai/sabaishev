import { ImageIcon } from "lucide-react";

interface ArtifactPlaceholderProps {
  title: string;
  hint?: string;
  artifactName?: string;
}

export default function ArtifactPlaceholder({
  title,
  hint,
  artifactName,
}: ArtifactPlaceholderProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-white/[0.03]">
        <ImageIcon className="h-5 w-5 text-foreground-muted" strokeWidth={1.5} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground-secondary">{title}</p>
        {artifactName && (
          <p className="text-xs text-foreground-muted">{artifactName}</p>
        )}
        {hint && (
          <p className="text-[11px] leading-relaxed text-foreground-muted/70">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
