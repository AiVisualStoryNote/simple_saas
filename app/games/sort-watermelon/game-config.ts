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
  id: "sort-watermelon",
  name: "Merge Watermelon",
  nameCn: "合成大西瓜",
  description: "Viral merge puzzle game - combine fruits to make a big watermelon",
  descriptionCn: "网红爆款合成益智游戏，合并水果合成大西瓜",
  route: "/games/sort-watermelon",
  icon: "🍉",
  coverImage: "",
  color: "#22C55E",
  difficulty: "easy",
  duration: "5-15 min",
  minPlayers: 1,
  maxPlayers: 1,
};

export { gameConfig };