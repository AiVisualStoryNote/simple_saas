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

export const gameConfig: GameConfig = {
  id: "flappy-bird",
  name: "Flappy Bird",
  nameCn: "Flappy Bird",
  description: "Tap to flap and avoid the pipes!",
  descriptionCn: "点击屏幕让小鸟飞翔，躲避管道！",
  route: "/games/flappy-bird",
  icon: "🐦",
  coverImage: "",
  color: "#F4D03F",
  difficulty: "medium",
  duration: "1-3 min",
  minPlayers: 1,
  maxPlayers: 1,
};