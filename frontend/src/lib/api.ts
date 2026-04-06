import type {
  HealthResponse,
  LabelsResponse,
  PredictResponse,
  SamplesResponse,
} from "@/lib/types";

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
    "http://localhost:8000"
  );
}

async function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const ctrl = new AbortController();
  const outer = init.signal;
  const timer = setTimeout(() => ctrl.abort(new Error("Request timed out")), timeoutMs);
  const onOuterAbort = () => {
    clearTimeout(timer);
    ctrl.abort();
  };
  if (outer) {
    if (outer.aborted) {
      clearTimeout(timer);
      ctrl.abort();
    } else {
      outer.addEventListener("abort", onOuterAbort, { once: true });
    }
  }
  try {
    return await fetch(input, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
    if (outer) {
      outer.removeEventListener("abort", onOuterAbort);
    }
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid JSON from API");
  }
}

export async function fetchHealth(
  outer?: AbortSignal,
): Promise<HealthResponse> {
  const res = await fetchWithTimeout(
    `${getBaseUrl()}/health`,
    { cache: "no-store", signal: outer },
    12_000,
  );
  if (!res.ok) {
    throw new Error(`Health check failed (${res.status})`);
  }
  return parseJson<HealthResponse>(res);
}

export async function fetchLabels(
  outer?: AbortSignal,
): Promise<LabelsResponse> {
  const res = await fetchWithTimeout(
    `${getBaseUrl()}/labels`,
    { cache: "no-store", signal: outer },
    12_000,
  );
  if (!res.ok) {
    throw new Error(`Labels request failed (${res.status})`);
  }
  return parseJson<LabelsResponse>(res);
}

export async function fetchSamples(
  outer?: AbortSignal,
): Promise<SamplesResponse> {
  const res = await fetchWithTimeout(
    `${getBaseUrl()}/samples`,
    { cache: "no-store", signal: outer },
    12_000,
  );
  if (!res.ok) {
    throw new Error(`Samples request failed (${res.status})`);
  }
  return parseJson<SamplesResponse>(res);
}

export async function predictMission(
  text: string,
  outer?: AbortSignal,
): Promise<PredictResponse> {
  const res = await fetchWithTimeout(
    `${getBaseUrl()}/predict`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: outer,
    },
    45_000,
  );
  const data = await parseJson<
    PredictResponse & { detail?: { error?: { message?: string } } | string }
  >(res);
  if (!res.ok) {
    const d = data.detail;
    const msg =
      typeof d === "object" && d && "error" in d && d.error?.message
        ? d.error.message
        : typeof d === "string"
          ? d
          : `Prediction failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}
