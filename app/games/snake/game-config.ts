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
  id: "snake",
  name: "Snake",
  nameCn: "经典贪吃蛇",
  description: "The classic Snake game! Eat food, grow longer, don't hit yourself or the wall!",
  descriptionCn: "经典贪吃蛇游戏！吃食物，变长身体，不要撞到自己和墙！",
  route: "/games/snake",
  icon: "🐍",
  coverImage: "",
  color: "#00f5d4",
  difficulty: "easy",
  duration: "1-10 min",
  minPlayers: 1,
  maxPlayers: 1,
};
