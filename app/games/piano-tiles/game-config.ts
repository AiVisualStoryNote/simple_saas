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
  id: "piano-tiles",
  name: "Piano Tiles",
  nameCn: "别踩白块",
  description: "Tap the black tiles, don't hit the white - test your speed",
  descriptionCn: "只点黑块不点白，考验手速和反应",
  route: "/games/piano-tiles",
  icon: "🎹",
  coverImage: "",
  color: "#1F2937",
  difficulty: "hard",
  duration: "1-3 min",
  minPlayers: 1,
  maxPlayers: 1,
};

export { gameConfig };