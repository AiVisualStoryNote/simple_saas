export type GameState = "menu" | "playing" | "won" | "lost";

export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export type Grid = Cell[][];

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export const DIFFICULTY = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};
