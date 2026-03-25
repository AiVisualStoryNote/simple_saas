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
  id: "color-sort",
  name: "Water Sort",
  nameCn: "水杯排序",
  description: "Popular relaxing puzzle game! Move liquids to sort all the same colors in the same tube!",
  descriptionCn: "热门休闲益智小游戏！移动液体，让同一个杯子里只有同一种颜色！",
  route: "/games/color-sort",
  icon: "🎨",
  coverImage: "",
  color: "#8b5cf6",
  difficulty: "easy",
  duration: "2-10 min",
  minPlayers: 1,
  maxPlayers: 1,
};
