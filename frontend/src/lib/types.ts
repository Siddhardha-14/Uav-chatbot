export type TopPrediction = {
  label: string;
  score: number;
};

export type PredictResponse = {
  input_text: string;
  predicted_label: string;
  predicted_domain: string;
  confidence: number;
  top_predictions: TopPrediction[];
  recommended_action: string;
  model_version: string;
};

export type HealthResponse = {
  status: string;
  version: string;
  model_backend: string;
  model_version: string;
};

export type LabelsResponse = {
  labels: string[];
  domains: string[];
  label_to_domain: Record<string, string>;
};

export type SamplePrompt = {
  text: string;
  domain: string;
};

export type SamplesResponse = {
  prompts: SamplePrompt[];
};

export type ApiError = {
  error?: { code?: string; message?: string };
  detail?: unknown;
};
