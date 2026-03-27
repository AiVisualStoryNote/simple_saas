import { GameConfig } from "../types";

export const gameConfig: GameConfig = {
  id: "piano-tiles",
  name: {
    en: "Piano Tiles",
    zh: "别踩白块",
  },
  description: {
    en: "Tap the black tiles, don't hit the white - test your speed",
    zh: "只点黑块不点白，考验手速和反应",
  },
  image: "/games/piano-tiles.png",
  category: "arcade",
  difficulty: "hard",
};

export { gameConfig as default };
