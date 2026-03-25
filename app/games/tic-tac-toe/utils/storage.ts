import { STORAGE_KEY, GameStats } from "../constants";

export function getStats(): GameStats {
  if (typeof window === "undefined") return { wins: 0, losses: 0, draws: 0 };
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : { wins: 0, losses: 0, draws: 0 };
}

export function saveStats(stats: GameStats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}
