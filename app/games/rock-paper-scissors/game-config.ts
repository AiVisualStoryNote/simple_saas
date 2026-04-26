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
  id: "rock-paper-scissors",
  name: "Rock Paper Scissors",
  nameCn: "石头剪刀布",
  description: "Classic hand game against computer",
  descriptionCn: "经典猜拳游戏，和电脑对战",
  route: "/games/rock-paper-scissors",
  icon: "✂️",
  coverImage: "",
  color: "#3B82F6",
  difficulty: "easy",
  duration: "1-5 min",
  minPlayers: 1,
  maxPlayers: 2,
};

export { gameConfig };