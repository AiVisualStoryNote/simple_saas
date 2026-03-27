import { GameConfig } from "../types";

export const gameConfig: GameConfig = {
  id: "rock-paper-scissors",
  name: {
    en: "Rock Paper Scissors",
    zh: "石头剪刀布",
  },
  description: {
    en: "Classic hand game against computer",
    zh: "经典猜拳游戏，和电脑对战",
  },
  image: "/games/rock-paper-scissors.png",
  category: "casual",
  difficulty: "easy",
};

export { gameConfig as default };
