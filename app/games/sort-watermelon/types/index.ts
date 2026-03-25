export type GameState = "menu" | "playing" | "gameover";

export interface Block {
  id: number;
  x: number;
  y: number;
  level: number;
  merged: boolean;
}

export const FRUIT_SIZES = [
  { size: 30, value: 2 },
  { size: 45, value: 4 },
  { size: 65, value: 8 },
  { size: 85, value: 16 },
  { size: 110, value: 32 },
  { size: 135, value: 64 },
  { size: 160, value: 128 },
  { size: 185, value: 256 },
  { size: 210, value: 512 },
  { size: 240, value: 1024 },
  { size: 270, value: 2048 },
];

export const FRUIT_COLORS = [
  "#FF6B6B",
  "#FF9E7D",
  "#FECA57",
  "#FFEAA7",
  "#00D2D3",
  "#4ECDC4",
  "#1A535C",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#D9534F",
];

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  gravity: number;
}
