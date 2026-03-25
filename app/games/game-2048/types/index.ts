export interface GameConfig {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  descriptionCn: string;
  route: string;
  icon: string;
  coverImage: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  minPlayers: number;
  maxPlayers: number;
}

export interface Cell {
  id?: number;
  row: number;
  col: number;
  value: number;
  merged?: boolean;
}

export type CellValue = number | null;
export type Grid = (Cell | null)[][];
export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameState = 'menu' | 'playing' | 'won' | 'gameover';