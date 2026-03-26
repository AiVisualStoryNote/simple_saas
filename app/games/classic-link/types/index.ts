export type GameState = "menu" | "playing" | "won" | "lost";

export interface Cell {
  x: number;
  y: number;
  opened: boolean;
  hasLink: boolean;
  isMine: boolean;
}

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export const COLORS = {
  1: "blue",
  2: "green",
  3: "red",
  4: "purple",
  5: "maroon",
  6: "cyan",
  7: "black",
  8: "gray",
};

export const STORAGE_KEY = "classic-link-best-time";
