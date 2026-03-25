import { GameConfig } from "./types";

export const GAME_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  gravity: 0.5,
  initialPower: 0,
  maxPower: 25,
  powerIncrement: 0.3,
  jumpVelocityX: 8,
};

export const COLORS = {
  background: "linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%)",
  player: "#FF6B6B",
  block: "#4ECDC4",
  blockPerfect: "#FFE66D",
  text: "#2C3E50",
};

export const STORAGE_KEY = "jump-jump-high-score";
