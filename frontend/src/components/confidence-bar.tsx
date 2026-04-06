import { formatScore } from "@/lib/format";

export function ConfidenceBar({
  value,
  id,
}: {
  value: number;
  id: string;
}) {
  const pct = Math.min(100, Math.max(0, value * 100));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted">
        <span id={id}>Confidence</span>
        <span aria-live="polite">{formatScore(value)}</span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-card-border"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-labelledby={id}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-[width] duration-500 dark:from-cyan-400 dark:to-sky-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
