export type GameState = "menu" | "playing" | "gameover";

export interface Tile {
  id: number;
  isBlack: boolean;
  y: number;
}
