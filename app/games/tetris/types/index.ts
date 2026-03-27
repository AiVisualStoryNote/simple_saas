export type GameState = "menu" | "playing" | "paused" | "gameover";

export interface Piece {
  shape: number[][];
  x: number;
  y: number;
  color: string;
}

export type Board = (string | null)[][];
