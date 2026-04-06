"use client";

import type { PredictResponse } from "@/lib/types";
import { formatLabelId } from "@/lib/format";

export type HistoryItem = {
  id: string;
  createdAt: string;
  prompt: string;
  result: PredictResponse;
};

export function SessionHistory({
  items,
  onSelect,
  onClear,
}: {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}) {
  if (!items.length) {
    return (
      <section
        className="rounded-2xl border border-dashed border-card-border bg-card/40 p-4"
        aria-label="Session history"
      >
        <h2 className="text-sm font-semibold text-foreground">Session history</h2>
        <p className="mt-2 text-sm text-muted">
          Submitted missions appear here for this browser session only.
        </p>
      </section>
    );
  }

  return (
    <section
      className="rounded-2xl border border-card-border bg-card p-4 shadow-sm"
      aria-label="Session history"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Session history</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-muted underline-offset-2 hover:text-accent hover:underline"
        >
          Clear
        </button>
      </div>
      <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {items.map((h) => (
          <li key={h.id}>
            <button
              type="button"
              onClick={() => onSelect(h)}
              className="w-full rounded-xl border border-card-border bg-background px-3 py-2 text-left text-sm transition hover:border-accent"
            >
              <p className="line-clamp-2 text-foreground">{h.prompt}</p>
              <p className="mt-1 text-xs text-muted">
                {formatLabelId(h.result.predicted_label)} ·{" "}
                {h.result.predicted_domain}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
