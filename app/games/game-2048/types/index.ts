export type GameState = "menu" | "playing" | "gameover" | "win";

export interface Cell {
  value: number;
  row: number;
  col: number;
  id: number;
  merged: boolean;
}

export type Grid = (Cell | null)[][];

export interface GameConfig {
  gridSize: number;
}

export type Direction = "up" | "down" | "left" | "right";
