import { ConfidenceBar } from "@/components/confidence-bar";
import { formatLabelId, formatScore } from "@/lib/format";
import type { PredictResponse } from "@/lib/types";

export function ResultPanel({ data }: { data: PredictResponse }) {
  return (
    <div className="space-y-4" aria-live="polite">
      <div className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-2xl border border-card-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Predicted domain
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {data.predicted_domain}
          </p>
          <p className="mt-3 text-xs text-muted">Intent label</p>
          <p className="font-mono text-sm text-accent">
            {formatLabelId(data.predicted_label)}
          </p>
        </article>
        <article className="rounded-2xl border border-card-border bg-card p-4 shadow-sm">
          <ConfidenceBar value={data.confidence} id="confidence-label" />
          <p className="mt-3 text-xs text-muted">
            Model version:{" "}
            <span className="font-mono text-foreground">{data.model_version}</span>
          </p>
        </article>
      </div>

      <article className="rounded-2xl border border-card-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">
          Top alternative predictions
        </h3>
        <ol className="mt-3 space-y-2">
          {data.top_predictions.map((t, i) => (
            <li
              key={`${t.label}-${i}`}
              className="flex items-center justify-between gap-3 rounded-xl bg-background px-3 py-2"
            >
              <span className="text-sm text-foreground">
                <span className="text-muted">{i + 1}.</span>{" "}
                {formatLabelId(t.label)}
              </span>
              <span className="font-mono text-xs text-muted">
                {formatScore(t.score)}
              </span>
            </li>
          ))}
        </ol>
      </article>

      <article className="rounded-2xl border border-accent/30 bg-accent-soft/40 p-4">
        <h3 className="text-sm font-semibold text-foreground">
          Recommended UAV workflow
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">
          {data.recommended_action}
        </p>
      </article>
    </div>
  );
}
