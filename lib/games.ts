import { gameConfig as runningMomentConfig } from "@/app/games/running-game/running-moment/game-config";
import { gameConfig as jumpJumpConfig } from "@/app/games/jump-jump/game-config";
import { gameConfig as snakeConfig } from "@/app/games/snake/game-config";
import { gameConfig as flappyBirdConfig } from "@/app/games/flappy-bird/game-config";
import { gameConfig as game2048Config } from "@/app/games/game-2048/game-config";
import { gameConfig as aircraftWarConfig } from "@/app/games/aircraft-war/game-config";
import { gameConfig as minesweeperConfig } from "@/app/games/minesweeper/game-config";
import { gameConfig as ticTacToeConfig } from "@/app/games/tic-tac-toe/game-config";
import { gameConfig as runShootConfig } from "@/app/games/run-shoot/game-config";
import { gameConfig as colorSortConfig } from "@/app/games/color-sort/game-config";
import { gameConfig as sortWatermelonConfig } from "@/app/games/sort-watermelon/game-config";
import { gameConfig as classicLinkConfig } from "@/app/games/classic-link/game-config";
import { gameConfig as rockPaperScissorsConfig } from "@/app/games/rock-paper-scissors/game-config";
import { gameConfig as tetrisConfig } from "@/app/games/tetris/game-config";
import { gameConfig as pianoTilesConfig } from "@/app/games/piano-tiles/game-config";
import { gameConfig as gobangConfig } from "@/app/games/gobang/game-config";
import { gameConfig as sudokuConfig } from "@/app/games/sudoku/game-config";
import { gameConfig as breakoutConfig } from "@/app/games/breakout/game-config";
import { gameConfig as sokobanConfig } from "@/app/games/sokoban/game-config";
import { gameConfig as memoryMatchConfig } from "@/app/games/memory-match/game-config";
import { GameConfig } from "@/app/games/classic-link/game-config";

const games: GameConfig[] = [
  runningMomentConfig,
  jumpJumpConfig,
  snakeConfig,
  flappyBirdConfig,
  game2048Config,
  aircraftWarConfig,
  minesweeperConfig,
  ticTacToeConfig,
  runShootConfig,
  colorSortConfig,
  sortWatermelonConfig,
  classicLinkConfig,
  rockPaperScissorsConfig,
  tetrisConfig,
  pianoTilesConfig,
  gobangConfig,
  sudokuConfig,
  breakoutConfig,
  sokobanConfig,
  memoryMatchConfig,
];

export default games;

export function getAllGames(): GameConfig[] {
  return games;
}

export function getGameById(id: string): GameConfig | undefined {
  return games.find(game => game.id === id);
}