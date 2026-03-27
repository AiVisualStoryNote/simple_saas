import { GameConfig } from "../types";

export const gameConfig: GameConfig = {
  id: "sudoku",
  name: {
    en: "Sudoku",
    zh: "数独",
  },
  description: {
    en: "Classic number puzzle game with three difficulty levels",
    zh: "经典数字益智游戏，支持三种难度",
  },
  image: "/games/sudoku.png",
  category: "puzzle",
  difficulty: "medium",
};

export { gameConfig as default };
