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
  maxPlayers: 1;
}

export const gameConfig: GameConfig = {
  id: "flappy-bird",
  name: "Flappy Bird",
  nameCn: "像素小鸟",
  description: "The famous flappy bird game! Tap to flap your wings and avoid pipes!",
  descriptionCn: "著名的像素小鸟游戏！点击/空格煽动翅膀，躲避管道！",
  route: "/games/flappy-bird",
  icon: "🐤",
  coverImage: "",
  color: "#FADC5D",
  difficulty: "medium",
  duration: "1-5 min",
  minPlayers: 1,
  maxPlayers: 1,
};
