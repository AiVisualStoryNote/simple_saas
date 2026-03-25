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
  difficulty: string;
  duration: string;
  minPlayers: number;
  maxPlayers: number;
}

export const gameConfig: GameConfig = {
  id: "run-shoot",
  name: "Run & Shoot",
  nameCn: "酷跑射击",
  description: "Popular viral endless run & shoot game! Move to dodge, shoot enemies, collect powerups and get higher score!",
  descriptionCn: "热门网红无尽酷跑射击！移动躲避敌人，射击消灭对手，收集道具，挑战更高分！",
  route: "/games/run-shoot",
  icon: "🏃",
  coverImage: "",
  color: "#4ade80",
  difficulty: "medium",
  duration: "2-10 min",
  minPlayers: 1,
  maxPlayers: 1,
};
