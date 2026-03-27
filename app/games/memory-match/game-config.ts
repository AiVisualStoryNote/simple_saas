import { GameConfig } from "../types";

export const gameConfig: GameConfig = {
  id: "memory-match",
  name: {
    en: "Memory Match",
    zh: "记忆翻牌",
  },
  description: {
    en: "Classic memory game - find all matching pairs",
    zh: "经典记忆游戏，找出所有配对",
  },
  image: "/games/memory-match.png",
  category: "puzzle",
  difficulty: "easy",
};

export { gameConfig as default };
