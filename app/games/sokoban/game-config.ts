import { GameConfig } from "../types";

export const gameConfig: GameConfig = {
  id: "sokoban",
  name: {
    en: "Sokoban",
    zh: "推箱子",
  },
  description: {
    en: "Classic puzzle game - push boxes to goals",
    zh: "经典推箱子益智游戏，把箱子推到目标位置",
  },
  image: "/games/sokoban.png",
  category: "puzzle",
  difficulty: "hard",
};

export { gameConfig as default };
