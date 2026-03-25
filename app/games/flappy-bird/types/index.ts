export type GameState = "menu" | "playing" | "paused" | "gameover";

export interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  birdX: number;
  birdRadius: number;
  gravity: number;
  jumpForce: number;
  pipeWidth: number;
  pipeGap: number;
  pipeSpeed: number;
  pipeSpawnInterval: number;
}
