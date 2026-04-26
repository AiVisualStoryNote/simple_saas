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
  id: "memory-match",
  name: "Memory Match",
  nameCn: "记忆翻牌",
  description: "Classic memory game - find all matching pairs",
  descriptionCn: "经典记忆游戏，找出所有配对",
  route: "/games/memory-match",
  icon: "🧠",
  coverImage: "",
  color: "#EC4899",
  difficulty: "easy",
  duration: "2-5 min",
  minPlayers: 1,
  maxPlayers: 1,
};

export { gameConfig };