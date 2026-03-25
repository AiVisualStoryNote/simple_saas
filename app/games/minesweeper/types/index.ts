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
  easy: { name: "easy" as const, rows: 9, cols: 9, mines: 10 },
  medium: { name: "medium" as const, rows: 16, cols: 16, mines: 40 },
  hard: { name: "hard" as const, rows: 16, cols: 30, mines: 99 },
};

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Difficulty {
  name: DifficultyLevel;
  config: GameConfig;
}