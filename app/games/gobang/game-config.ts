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
  id: "gobang",
  name: "Gobang Five in a Row",
  nameCn: "五子棋",
  description: "Classic five-in-a-row board game for two players",
  descriptionCn: "经典五子棋双人对弈，连成五子获胜",
  route: "/games/gobang",
  icon: "🎯",
  coverImage: "",
  color: "#10B981",
  difficulty: "medium",
  duration: "10-20 min",
  minPlayers: 2,
  maxPlayers: 2,
};

export { gameConfig };