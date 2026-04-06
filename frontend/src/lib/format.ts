export function formatLabelId(id: string): string {
  return id
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatScore(score: number): string {
  return `${Math.round(score * 1000) / 10}%`;
}
