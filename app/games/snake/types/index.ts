export type GameState = "menu" | "playing" | "paused" | "gameover";

export interface Position {
  x: number;
  y: number;
}

export interface GameConfig {
  gridSize: number;
  cellCount: number;
  initialSpeed: number;
  speedIncrease: number;
}

export type Direction = "up" | "down" | "left" | "right";
