import type { SamplePrompt } from "@/lib/types";

export function SamplePromptChips({
  samples,
  disabled,
  onPick,
}: {
  samples: SamplePrompt[];
  disabled?: boolean;
  onPick: (text: string) => void;
}) {
  if (!samples.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        Try a sample mission
      </p>
      <div className="flex flex-wrap gap-2" role="list">
        {samples.slice(0, 8).map((s) => (
          <button
            key={s.text}
            type="button"
            role="listitem"
            disabled={disabled}
            onClick={() => onPick(s.text)}
            className="max-w-full rounded-full border border-card-border bg-card px-3 py-1.5 text-left text-xs text-foreground transition hover:border-accent hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            <span className="line-clamp-2">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
