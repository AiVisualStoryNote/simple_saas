export interface GameConfig {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  descriptionCn: string;
  route: string;
  icon: string;
  coverImage: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  minPlayers: number;
  maxPlayers: number;
}

export const gameConfig: GameConfig = {
  id: "game-2048",
  name: "2048",
  nameCn: "2048",
  description: "The classic number merging puzzle game! Combine tiles to reach the 2048 tile!",
  descriptionCn: "经典数字合成益智游戏！合并方块，合成出 2048！",
  route: "/games/game-2048",
  icon: "🔢",
  coverImage: "",
  color: "#faf8ef",
  difficulty: "medium",
  duration: "5-15 min",
  minPlayers: 1,
  maxPlayers: 1,
};
