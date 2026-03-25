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
  maxPlayers: number;
}

export const gameConfig: GameConfig = {
  id: "tic-tac-toe",
  name: "Tic Tac Toe",
  nameCn: "井字棋",
  description: "The classic XO game! Play against the AI and try to win!",
  descriptionCn: "经典XO井字棋！对战AI，看看你能不能赢！",
  route: "/games/tic-tac-toe",
  icon: "⭕",
  coverImage: "",
  color: "#f0f0f0",
  difficulty: "easy",
  duration: "1-3 min",
  minPlayers: 1,
  maxPlayers: 1,
};
