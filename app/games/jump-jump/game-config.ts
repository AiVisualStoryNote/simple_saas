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
  id: "jump-jump",
  name: "Jump Jump",
  nameCn: "跳一跳",
  description: "The classic viral jumping game! Hold to charge power, release to jump. Beat your high score!",
  descriptionCn: "经典网红跳跃游戏！按住蓄力，松开跳跃。打破你的最高分记录！",
  route: "/games/jump-jump",
  icon: "🤸",
  coverImage: "",
  color: "#FF6B6B",
  difficulty: "easy",
  duration: "1-5 min",
  minPlayers: 1,
  maxPlayers: 1,
};
