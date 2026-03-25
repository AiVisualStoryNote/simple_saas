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
  id: "minesweeper",
  name: "Minesweeper",
  nameCn: "经典扫雷",
  description: "The classic puzzle game! Flag all the mines without stepping on one!",
  descriptionCn: "经典益智扫雷游戏！标记所有地雷，不要踩到！",
  route: "/games/minesweeper",
  icon: "💣",
  coverImage: "",
  color: "#c0c0c0",
  difficulty: "medium",
  duration: "5-20 min",
  minPlayers: 1,
  maxPlayers: 1,
};
