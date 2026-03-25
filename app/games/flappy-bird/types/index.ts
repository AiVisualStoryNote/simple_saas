export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

export type GameState = 'idle' | 'playing' | 'paused' | 'gameover';

export interface Bird {
  x: number;
  y: number;
  velocity: number;
}

export interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}