import { GameConfig } from "./types";

export const GAME_CONFIG: GameConfig = {
  gridSize: 20,
  cellCount: 20,
  initialSpeed: 150,
  speedIncrease: 5,
};

export const COLORS = {
  background: "#1a1a2e",
  gridLine: "#16213e",
  snakeHead: "#00f5d4",
  snakeBody: "#00bbf9",
  food: "#fb5607",
  text: "#ffffff",
};

export const STORAGE_KEY = "snake-high-score";
