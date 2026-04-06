"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { ResultPanel } from "@/components/result-panel";
import { SamplePromptChips } from "@/components/sample-prompt-chips";
import {
  SessionHistory,
  type HistoryItem,
} from "@/components/session-history";
import { fetchSamples, predictMission } from "@/lib/api";
import type { PredictResponse, SamplePrompt } from "@/lib/types";

const HISTORY_KEY = "uav-mission-analyzer-history-v1";
const MAX_HISTORY = 24;

function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]) {
  sessionStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

export function AnalyzerView() {
  const formId = useId();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [samples, setSamples] = useState<SamplePrompt[]>([]);
  const [samplesError, setSamplesError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetchSamples(ac.signal)
      .then((r) => setSamples(r.prompts))
      .catch(() =>
        setSamplesError("Could not load sample missions (API unavailable)."),
      );
    return () => ac.abort();
  }, []);

  const pushHistory = useCallback((prompt: string, res: PredictResponse) => {
    const item: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      prompt,
      result: res,
    };
    setHistory((prev) => {
      const next = [item, ...prev.filter((x) => x.prompt !== prompt)].slice(
        0,
        MAX_HISTORY,
      );
      saveHistory(next);
      return next;
    });
  }, []);

  const onSubmit = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await predictMission(trimmed);
      setResult(res);
      pushHistory(trimmed, res);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Something went wrong. Try again.";
      setError(msg);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [loading, pushHistory, text]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void onSubmit();
    }
  };

  const statusMessage = useMemo(() => {
    if (loading) {
      return "Analyzing mission text…";
    }
    if (error) {
      return "Analysis failed.";
    }
    if (result) {
      return "Analysis complete.";
    }
    return "Ready for a mission prompt.";
  }, [error, loading, result]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Mission analyzer
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
          Describe a UAV mission in plain language. The model returns intent,
          domain, confidence, alternatives, and a concise operational
          recommendation.
        </p>
        <p
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {statusMessage}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-6">
          <section
            className="rounded-2xl border border-card-border bg-card p-4 shadow-sm sm:p-5"
            aria-labelledby={`${formId}-heading`}
          >
            <h2
              id={`${formId}-heading`}
              className="text-sm font-semibold text-foreground"
            >
              Mission prompt
            </h2>
            <label htmlFor={`${formId}-input`} className="sr-only">
              Mission description
            </label>
            <textarea
              id={`${formId}-input`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              rows={5}
              placeholder='Example: "Inspect crop stress in the north field"'
              className="mt-3 w-full resize-y rounded-xl border border-card-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted"
              disabled={loading}
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void onSubmit()}
                disabled={loading || !text.trim()}
                className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-950"
              >
                {loading ? "Analyzing…" : "Analyze mission"}
              </button>
              <span className="text-xs text-muted">
                Shortcut: Ctrl+Enter / ⌘+Enter
              </span>
            </div>
            {samplesError && (
              <p className="mt-3 text-xs text-danger" role="alert">
                {samplesError}
              </p>
            )}
            <div className="mt-5">
              <SamplePromptChips
                samples={samples}
                disabled={loading}
                onPick={(t) => {
                  setText(t);
                  setError(null);
                }}
              />
            </div>
          </section>

          <SessionHistory
            items={history}
            onSelect={(h) => {
              setText(h.prompt);
              setResult(h.result);
              setError(null);
            }}
            onClear={() => {
              setHistory([]);
              saveHistory([]);
            }}
          />
        </div>

        <section
          className="rounded-2xl border border-card-border bg-card/60 p-4 shadow-sm sm:p-6 lg:min-h-[28rem]"
          aria-label="Analysis results"
        >
          {loading && (
            <div className="space-y-4 animate-pulse" aria-busy="true">
              <div className="h-24 rounded-2xl bg-card-border/80" />
              <div className="h-40 rounded-2xl bg-card-border/80" />
              <div className="h-32 rounded-2xl bg-card-border/80" />
            </div>
          )}

          {!loading && error && (
            <div
              className="rounded-2xl border border-danger/40 bg-red-500/5 p-4 text-sm text-danger dark:bg-red-500/10"
              role="alert"
            >
              <p className="font-semibold">Unable to reach the analyzer API</p>
              <p className="mt-2 text-foreground/90 dark:text-foreground/80">
                {error}
              </p>
              <p className="mt-3 text-xs text-muted">
                Ensure the FastAPI backend is running and{" "}
                <code className="rounded bg-card-border px-1 py-0.5 font-mono text-[11px]">
                  NEXT_PUBLIC_API_BASE_URL
                </code>{" "}
                points to it.
              </p>
            </div>
          )}

          {!loading && !error && !result && (
            <div className="flex h-full min-h-[16rem] flex-col items-center justify-center text-center">
              <p className="text-sm font-medium text-foreground">
                No analysis yet
              </p>
              <p className="mt-2 max-w-sm text-sm text-muted">
                Enter a mission on the left and run analysis to see structured
                predictions, confidence, and a recommended workflow.
              </p>
            </div>
          )}

          {!loading && !error && result && <ResultPanel data={result} />}
        </section>
      </div>
    </div>
  );
}
