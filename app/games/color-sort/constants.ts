import { GameConfig } from "./types";

// 中等难度：4种颜色，2个空管
export const DEFAULT_CONFIG: GameConfig = {
  tubeCount: 6,
  tubeCapacity: 4,
  emptyTubes: 2,
};

export const STORAGE_KEY = "color-sort-best-levels";
