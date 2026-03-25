import { GameConfig } from "./types";

export const GAME_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  playerX: 50,
  playerWidth: 40,
  playerHeight: 60,
  enemySpawnInterval: 1200,
  powerUpSpawnInterval: 8000,
  baseSpeed: 5,
};

export const COLORS = {
  background: "#1a1a2e",
  player: "#4ade80",
  bullet: "#ffffff",
  enemy: "#ef4444",
  healthPowerUp: "#22c55e",
  speedPowerUp: "#3b82f6",
  multishotPowerUp: "#eab308",
  ground: "#65a30d",
  sky: "#87ceeb",
};

export const POWERUP_NAMES = {
  health: "❤️ +1 生命",
  speed: "⚡ 加速",
  multishot: "🔥 多重射击",
};

export const STORAGE_KEY = "run-shoot-high-score";
