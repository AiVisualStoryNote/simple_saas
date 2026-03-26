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
  id: "classic-link",
  name: "Classic Link",
  nameCn: "经典连连看",
  description: "The classic matching puzzle game! connect same blocks and clear the board!",
  descriptionCn: "经典匹配消除益智游戏！连接相同方块，清空整个棋盘！",
  route: "/games/classic-link",
  icon: "🔗",
  coverImage: "",
  color: "#8b5cf6",
  difficulty: "easy",
  duration: "2-10 min",
  minPlayers: 1,
  maxPlayers: 1,
};
