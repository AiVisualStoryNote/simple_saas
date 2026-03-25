import { GameConfig } from "./types";

export const GAME_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  playerWidth: 50,
  playerHeight: 60,
  enemySpawnInterval: 1500,
  bulletSpeed: 8,
};

export const ENEMY_CONFIG = {
  small: {
    width: 40,
    height: 40,
    hp: 1,
    speed: 3,
  },
  medium: {
    width: 60,
    height: 60,
    hp: 3,
    speed: 2,
  },
  large: {
    width: 100,
    height: 80,
    hp: 10,
    speed: 1,
  },
};

export const COLORS = {
  background: "#0a0a1a",
  player: "#4fc3f7",
  bulletPlayer: "#ffffff",
  bulletEnemy: "#ff5252",
  enemySmall: "#66bb6a",
  enemyMedium: "#ffa726",
  enemyLarge: "#ef5350",
  text: "#ffffff",
};

export const STORAGE_KEY = "aircraft-war-high-score";
