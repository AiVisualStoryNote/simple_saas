import { gameConfig as runningMomentConfig } from "@/app/games/running-game/running-moment/game-config";
import { gameConfig as jumpJumpConfig } from "@/app/games/jump-jump/game-config";
import { gameConfig as snakeConfig } from "@/app/games/snake/game-config";
import { gameConfig as flappyBirdConfig } from "@/app/games/flappy-bird/game-config";
import { gameConfig as game2048Config } from "@/app/games/game-2048/game-config";
import { GameConfig } from "@/app/games/game-2048/game-config";

const games: GameConfig[] = [
  runningMomentConfig,
  jumpJumpConfig,
  snakeConfig,
  flappyBirdConfig,
  game2048Config,
];

export function getAllGames(): GameConfig[] {
  return games;
}

export function getGameById(id: string): GameConfig | undefined {
  return games.find(game => game.id === id);
}
