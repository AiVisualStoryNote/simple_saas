import { GameConfig } from "../types";

export const gameConfig: GameConfig = {
  id: "gobang",
  name: {
    en: "Gobang Five in a Row",
    zh: "五子棋",
  },
  description: {
    en: "Classic five-in-a-row board game for two players",
    zh: "经典五子棋双人对弈，连成五子获胜",
  },
  image: "/games/gobang.png",
  category: "board",
  difficulty: "medium",
};

export { gameConfig as default };
