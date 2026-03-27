const STORAGE_KEY = "breakout-high-score";

export function getHighScore(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

export function saveHighScore(score: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, score.toString());
}
