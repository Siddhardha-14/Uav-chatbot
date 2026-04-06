"use client";

import { useCallback, useEffect, useId, useState } from "react";
import {
  fetchHealth,
  fetchLabels,
  predictMission,
} from "@/lib/api";
import type { HealthResponse, LabelsResponse, PredictResponse } from "@/lib/types";
import { ResultPanel } from "@/components/result-panel";

export function AdminView() {
  const baseId = useId();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [labels, setLabels] = useState<LabelsResponse | null>(null);
  const [labelsError, setLabelsError] = useState<string | null>(null);
  const [testText, setTestText] = useState(
    "Perform border reconnaissance over sector 7",
  );
  const [predLoading, setPredLoading] = useState(false);
  const [predError, setPredError] = useState<string | null>(null);
  const [pred, setPred] = useState<PredictResponse | null>(null);

  const refreshHealth = useCallback(() => {
    setHealthError(null);
    fetchHealth()
      .then(setHealth)
      .catch((e) =>
        setHealthError(e instanceof Error ? e.message : "Health check failed"),
      );
  }, []);

  const refreshLabels = useCallback(() => {
    setLabelsError(null);
    fetchLabels()
      .then(setLabels)
      .catch((e) =>
        setLabelsError(e instanceof Error ? e.message : "Labels fetch failed"),
      );
  }, []);

  useEffect(() => {
    refreshHealth();
    refreshLabels();
  }, [refreshHealth, refreshLabels]);

  const runPredict = useCallback(async () => {
    const t = testText.trim();
    if (!t) {
      return;
    }
    setPredLoading(true);
    setPredError(null);
    try {
      const r = await predictMission(t);
      setPred(r);
    } catch (e) {
      setPred(null);
      setPredError(e instanceof Error ? e.message : "Predict failed");
    } finally {
      setPredLoading(false);
    }
  }, [testText]);

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Admin &amp; API test
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
          Quick diagnostics for demos: health, supported labels, and a manual{" "}
          <code className="rounded bg-card-border px-1 py-0.5 font-mono text-xs">
            POST /predict
          </code>{" "}
          call.
        </p>
        <p className="mt-2 text-xs text-muted">
          Configured API base:{" "}
          <span className="font-mono text-foreground">{apiBase}</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section
          className="rounded-2xl border border-card-border bg-card p-4 shadow-sm"
          aria-labelledby={`${baseId}-health`}
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id={`${baseId}-health`}
              className="text-sm font-semibold text-foreground"
            >
              GET /health
            </h2>
            <button
              type="button"
              onClick={refreshHealth}
              className="text-xs font-medium text-accent underline-offset-2 hover:underline"
            >
              Refresh
            </button>
          </div>
          {healthError && (
            <p className="mt-3 text-sm text-danger" role="alert">
              {healthError}
            </p>
          )}
          {health && !healthError && (
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">status</dt>
                <dd className="font-mono text-foreground">{health.status}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">API version</dt>
                <dd className="font-mono text-foreground">{health.version}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">model backend</dt>
                <dd className="font-mono text-foreground">
                  {health.model_backend}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">model version</dt>
                <dd className="font-mono text-xs text-foreground sm:text-sm">
                  {health.model_version}
                </dd>
              </div>
            </dl>
          )}
          {!health && !healthError && (
            <p className="mt-3 text-sm text-muted">Loading…</p>
          )}
        </section>

        <section
          className="rounded-2xl border border-card-border bg-card p-4 shadow-sm"
          aria-labelledby={`${baseId}-labels`}
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id={`${baseId}-labels`}
              className="text-sm font-semibold text-foreground"
            >
              GET /labels
            </h2>
            <button
              type="button"
              onClick={refreshLabels}
              className="text-xs font-medium text-accent underline-offset-2 hover:underline"
            >
              Refresh
            </button>
          </div>
          {labelsError && (
            <p className="mt-3 text-sm text-danger" role="alert">
              {labelsError}
            </p>
          )}
          {labels && !labelsError && (
            <pre className="mt-3 max-h-64 overflow-auto rounded-xl bg-background p-3 text-xs text-foreground">
              {JSON.stringify(labels, null, 2)}
            </pre>
          )}
          {!labels && !labelsError && (
            <p className="mt-3 text-sm text-muted">Loading…</p>
          )}
        </section>
      </div>

      <section
        className="rounded-2xl border border-card-border bg-card p-4 shadow-sm sm:p-5"
        aria-labelledby={`${baseId}-predict`}
      >
        <h2
          id={`${baseId}-predict`}
          className="text-sm font-semibold text-foreground"
        >
          POST /predict (smoke test)
        </h2>
        <label htmlFor={`${baseId}-ta`} className="mt-3 block text-xs text-muted">
          Mission text
        </label>
        <textarea
          id={`${baseId}-ta`}
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-card-border bg-background px-3 py-2 text-sm text-foreground"
        />
        <button
          type="button"
          onClick={() => void runPredict()}
          disabled={predLoading || !testText.trim()}
          className="mt-3 inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:text-slate-950"
        >
          {predLoading ? "Running…" : "Run prediction"}
        </button>
        {predError && (
          <p className="mt-3 text-sm text-danger" role="alert">
            {predError}
          </p>
        )}
        {pred && !predError && (
          <div className="mt-6">
            <ResultPanel data={pred} />
          </div>
        )}
      </section>
    </div>
  );
}
