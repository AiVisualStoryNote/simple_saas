export type GameState = "menu" | "playing" | "paused" | "gameover";

export interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  gravity: number;
  initialPower: number;
  maxPower: number;
  powerIncrement: number;
  jumpVelocityX: number;
}
