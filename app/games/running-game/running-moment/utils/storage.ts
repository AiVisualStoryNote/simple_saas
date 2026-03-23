import { PlayerProgress, ItemType } from "../types/index";

const STORAGE_KEY = "running_moment_progress";

const DEFAULT_PROGRESS: PlayerProgress = {
  highScore: 0,
  totalCoins: 0,
  charactersUnlocked: ["runner"],
  itemsOwned: [],
};

export function getProgress(): PlayerProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_PROGRESS;
  
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: PlayerProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateHighScore(distance: number): boolean {
  const progress = getProgress();
  if (distance > progress.highScore) {
    progress.highScore = Math.floor(distance);
    saveProgress(progress);
    return true;
  }
  return false;
}

export function addCoins(amount: number): number {
  const progress = getProgress();
  progress.totalCoins += amount;
  saveProgress(progress);
  return progress.totalCoins;
}

export function spendCoins(amount: number): boolean {
  const progress = getProgress();
  if (progress.totalCoins >= amount) {
    progress.totalCoins -= amount;
    saveProgress(progress);
    return true;
  }
  return false;
}

export function unlockCharacter(characterId: string): boolean {
  const progress = getProgress();
  if (!progress.charactersUnlocked.includes(characterId)) {
    progress.charactersUnlocked.push(characterId);
    saveProgress(progress);
    return true;
  }
  return false;
}

export function isCharacterUnlocked(characterId: string): boolean {
  const progress = getProgress();
  return progress.charactersUnlocked.includes(characterId);
}

export function purchaseItem(itemType: ItemType): boolean {
  const progress = getProgress();
  if (!progress.itemsOwned.includes(itemType)) {
    progress.itemsOwned.push(itemType);
    saveProgress(progress);
    return true;
  }
  return false;
}

export function hasItem(itemType: ItemType): boolean {
  const progress = getProgress();
  return progress.itemsOwned.includes(itemType);
}

export function useItem(itemType: ItemType): boolean {
  const progress = getProgress();
  const index = progress.itemsOwned.indexOf(itemType);
  if (index > -1) {
    progress.itemsOwned.splice(index, 1);
    saveProgress(progress);
    return true;
  }
  return false;
}
