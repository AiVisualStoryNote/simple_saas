import { GameConfig } from "../types";

export const gameConfig: GameConfig = {
  id: "tetris",
  name: {
    en: "Tetris",
    zh: "俄罗斯方块",
  },
  description: {
    en: "Classic block puzzle game - clear lines to score",
    zh: "经典方块消除游戏，消除行获得高分",
  },
  image: "/games/tetris.png",
  category: "puzzle",
  difficulty: "medium",
};

export { gameConfig as default };
