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
  id: "sudoku",
  name: "Sudoku",
  nameCn: "数独",
  description: "Classic number puzzle game with three difficulty levels",
  descriptionCn: "经典数字益智游戏，支持三种难度",
  route: "/games/sudoku",
  icon: "🔢",
  coverImage: "",
  color: "#6366F1",
  difficulty: "medium",
  duration: "5-20 min",
  minPlayers: 1,
  maxPlayers: 1,
};

export { gameConfig };