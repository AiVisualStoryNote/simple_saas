export type GameState = "menu" | "playing" | "won";

export interface Tube {
  id: number;
  colors: number[];
}

export interface GameConfig {
  tubeCount: number;
  tubeCapacity: number;
  emptyTubes: number;
}

export const COLOR_LIST = [
  "#ef4444", // red
  "#f59e0b", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
  "#06b6d4", // cyan
];

export const COLOR_NAMES = [
  "红色",
  "橙色",
  "黄色",
  "绿色",
  "蓝色",
  "紫色",
  "粉色",
  "青绿色",
  "桔色",
  "青色",
];
