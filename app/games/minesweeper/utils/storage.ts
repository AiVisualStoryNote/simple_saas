import { STORAGE_KEY } from "../constants";

export function getBestTime(difficulty: string): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(`${STORAGE_KEY}-${difficulty}`);
  return stored ? parseInt(stored, 10) : 0;
}

export function saveBestTime(difficulty: string, time: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_KEY}-${difficulty}`, time.toString());
}
