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
  id: "breakout",
  name: "Breakout",
  nameCn: "打砖块",
  description: "Classic arcade breakout game - break all the bricks",
  descriptionCn: "经典街机打砖块，打掉所有砖块通关",
  route: "/games/breakout",
  icon: "🧱",
  coverImage: "",
  color: "#FF6B6B",
  difficulty: "medium",
  duration: "3-5 min",
  minPlayers: 1,
  maxPlayers: 1,
};

export { gameConfig };