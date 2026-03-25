const STORAGE_KEY = "game_2048_high_score";

export function getHighScore(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

export function getBestScore(): number {
  return getHighScore();
}

export function setHighScore(score: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, score.toString());
}

export function setBestScore(score: number): void {
  setHighScore(score);
}

export function saveBestScore(score: number): void {
  setHighScore(score);
}
