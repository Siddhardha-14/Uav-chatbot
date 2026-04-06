import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_minmax(0,1fr)] lg:items-center">
        <div>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Understand UAV missions from natural language.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            The{" "}
            <strong className="font-semibold text-foreground">
              UAV Mission Intent Analyzer
            </strong>{" "}
            classifies free-text drone mission requests into operational
            domains—agriculture, defence, surveillance, and rescue—with
            confidence, runner-up hypotheses, and workflow recommendations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/analyzer"
              className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 dark:text-slate-950"
            >
              Open analyzer
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-xl border border-card-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent"
            >
              Admin / API test
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-card-border bg-card p-6 shadow-lg">
          <h2 className="text-sm font-semibold text-foreground">
            What you can ask
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <span className="font-medium text-foreground">Agriculture:</span>{" "}
              crop stress, spraying, field mapping.
            </li>
            <li>
              <span className="font-medium text-foreground">Defence:</span>{" "}
              border patrol, reconnaissance, target tracking.
            </li>
            <li>
              <span className="font-medium text-foreground">Surveillance:</span>{" "}
              perimeter monitoring, area surveillance.
            </li>
            <li>
              <span className="font-medium text-foreground">Rescue:</span> search
              and rescue, disaster assessment, survivor search.
            </li>
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-muted">
            Outputs include predicted label and domain, calibrated confidence,
            the top three alternative classes, and a short recommended UAV
            workflow tailored to the prediction.
          </p>
        </div>
      </div>
    </div>
  );
}
