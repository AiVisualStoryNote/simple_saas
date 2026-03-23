import { gameConfig as runningMomentConfig } from "@/app/games/running-game/running-moment/game-config";
import { GameConfig } from "@/app/games/running-game/running-moment/types";

const games: GameConfig[] = [
  runningMomentConfig,
];

export function getAllGames(): GameConfig[] {
  return games;
}

export function getGameById(id: string): GameConfig | undefined {
  return games.find(game => game.id === id);
}
