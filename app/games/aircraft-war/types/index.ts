export type GameState = "menu" | "playing" | "paused" | "gameover";

export interface Bullet {
  x: number;
  y: number;
  speed: number;
  damage: number;
  isPlayer: boolean;
}

export interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  speed: number;
  type: "small" | "medium" | "large";
}

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  playerWidth: number;
  playerHeight: number;
  enemySpawnInterval: number;
  bulletSpeed: number;
}
