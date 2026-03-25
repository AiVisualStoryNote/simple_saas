export type GameState = "menu" | "playing" | "paused" | "gameover";

export interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  speed: number;
}

export interface Bullet {
  x: number;
  y: number;
  speed: number;
  damage: number;
}

export interface PowerUp {
  x: number;
  y: number;
  type: "health" | "speed" | "multishot";
  width: number;
  height: number;
}

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  playerX: number;
  playerWidth: number;
  playerHeight: number;
  enemySpawnInterval: number;
  powerUpSpawnInterval: number;
  baseSpeed: number;
}

export type PowerUpType = "health" | "speed" | "multishot";
