export type GameState = "menu" | "playing" | "won" | "draw";
export type CellValue = "X" | "O" | null;
export type Board = CellValue[];

export interface GameStats {
  wins: number;
  losses: number;
  draws: number;
}