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
  id: "tetris",
  name: "Tetris",
  nameCn: "俄罗斯方块",
  description: "Classic block puzzle game - clear lines to score",
  descriptionCn: "经典方块消除游戏，消除行获得高分",
  route: "/games/tetris",
  icon: "🧱",
  coverImage: "",
  color: "#EF4444",
  difficulty: "medium",
  duration: "5-10 min",
  minPlayers: 1,
  maxPlayers: 1,
};

export { gameConfig };