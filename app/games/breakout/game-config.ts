import { GameConfig } from "../types";

export const gameConfig: GameConfig = {
  id: "breakout",
  name: {
    en: "Breakout",
    zh: "打砖块",
  },
  description: {
    en: "Classic arcade breakout game - break all the bricks",
    zh: "经典街机打砖块，打掉所有砖块通关",
  },
  image: "/games/breakout.png",
  category: "arcade",
  difficulty: "medium",
};

export { gameConfig as default };
