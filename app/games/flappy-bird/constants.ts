import { GameConfig } from "./types";

export const GAME_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  birdX: 150,
  birdRadius: 18,
  gravity: 0.5,
  jumpForce: -10,
  pipeWidth: 80,
  pipeGap: 200,
  pipeSpeed: 3,
  pipeSpawnInterval: 1500,
};

export const COLORS = {
  background: "linear-gradient(180deg, #71C5CF 0%, #87CEEB 100%)",
  bird: "#FADC5D",
  pipe: "#4CAF50",
  pipeBorder: "#2E7D32",
  ground: "#D4A574",
  text: "#2C3E50",
};

export const STORAGE_KEY = "flappy-bird-high-score";
