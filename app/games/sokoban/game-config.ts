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

const gameConfig: GameConfig = {
  id: "sokoban",
  name: "Sokoban",
  nameCn: "推箱子",
  description: "Classic puzzle game - push boxes to goals",
  descriptionCn: "经典推箱子益智游戏，把箱子推到目标位置",
  route: "/games/sokoban",
  icon: "📦",
  coverImage: "",
  color: "#F59E0B",
  difficulty: "hard",
  duration: "10-30 min",
  minPlayers: 1,
  maxPlayers: 1,
};

export { gameConfig };